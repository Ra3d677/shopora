"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Loader2, CreditCard, CheckCircle2 } from "lucide-react";

function StripeForm({ slug, amount, onSuccess, onError }: {
  slug: string;
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (msg: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch(`/api/store/${slug}/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    })
      .then(res => res.json())
      .then(data => {
        if (data.clientSecret) setClientSecret(data.clientSecret);
        else onError(data.error || "Failed to initialize payment");
      })
      .catch(() => onError("Failed to connect to payment provider"));
  }, [slug, amount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: window.location.href,
      },
    });

    if (error) {
      onError(error.message || "Payment failed");
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent.id);
    } else {
      onError("Payment was not completed");
      setIsLoading(false);
    }
  };

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin opacity-50" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-white text-black h-14 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg"
      >
        {isLoading ? (
          <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
        ) : (
          <><CreditCard className="h-5 w-5" /> Pay ${amount.toFixed(2)}</>
        )}
      </button>
    </form>
  );
}

export default function StripePaymentForm({ publishableKey, slug, amount, onSuccess, onError }: {
  publishableKey: string;
  slug: string;
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (msg: string) => void;
}) {
  const [stripePromise] = useState(() => loadStripe(publishableKey));

  return (
    <Elements stripe={stripePromise} options={{ mode: "payment", amount: Math.round(amount * 100), currency: "usd" }}>
      <StripeForm slug={slug} amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}
