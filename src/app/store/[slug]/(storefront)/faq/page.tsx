import React from 'react';
import { Plus } from 'lucide-react';

const faqs = [
  {
    question: "What is your return policy?",
    answer: "We accept returns within 30 days of the delivery date. Items must be unworn, unwashed, and have the original tags attached. Final sale items cannot be returned or exchanged."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping typically takes 3-5 business days. Express shipping takes 1-2 business days. International orders may take 7-14 business days depending on the destination."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to over 50 countries worldwide. International shipping costs and delivery times vary by location and will be calculated at checkout."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order has shipped, you will receive a confirmation email containing a tracking number. You can use this number on our carrier's website to track your package's progress."
  },
  {
    question: "Can I change or cancel my order?",
    answer: "We process orders very quickly. If you need to change or cancel your order, please contact our support team within 1 hour of placing it. After that window, we cannot guarantee changes can be made."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, and Google Pay."
  }
];

export default async function FAQPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions about our products, shipping, and returns.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <details key={index} className="group border border-slate-200 rounded-2xl bg-white [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-slate-900">
                <h2 className="font-semibold text-lg">{faq.question}</h2>
                <span className="relative size-5 shrink-0">
                  <Plus className="absolute inset-0 size-5 transition-transform group-open:-rotate-45" />
                </span>
              </summary>
              <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-16 text-center bg-slate-50 p-10 rounded-3xl border border-slate-100">
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Still have questions?</h3>
          <p className="text-slate-600 mb-6">If you couldn't find what you're looking for, our support team is here to help.</p>
          <a href={`/store/${slug}/contact`} className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
