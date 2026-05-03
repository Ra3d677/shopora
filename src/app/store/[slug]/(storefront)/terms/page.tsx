import React from 'react';

export default function TermsOfServicePage() {
  const lastUpdated = "April 24, 2026";

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-lg">
            Last Updated: {lastUpdated}
          </p>
        </div>

        <div className="prose prose-slate prose-lg max-w-none text-slate-600">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b pb-2">1. Agreement to Terms</h2>
            <p className="mb-4">
              These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and LUXE ("Company," "we," "us," or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
            </p>
            <p>
              You agree that by accessing the site, you have read, understood, and agreed to be bound by all of these Terms of Service. If you do not agree with all of these terms, then you are expressly prohibited from using the site and you must discontinue use immediately.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b pb-2">2. Intellectual Property Rights</h2>
            <p className="mb-4">
              Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us.
            </p>
            <p>
              The Content and the Marks are provided on the Site "AS IS" for your information and personal use only. Except as expressly provided in these Terms of Service, no part of the Site and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b pb-2">3. User Representations</h2>
            <p className="mb-4">
              By using the Site, you represent and warrant that:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>All registration information you submit will be true, accurate, current, and complete.</li>
              <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
              <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
              <li>You will not access the Site through automated or non-human means, whether through a bot, script, or otherwise.</li>
              <li>You will not use the Site for any illegal or unauthorized purpose.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b pb-2">4. Products and Purchases</h2>
            <p className="mb-4">
              We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products.
            </p>
            <p>
              All products are subject to availability. We reserve the right to discontinue any products at any time for any reason. Prices for all products are subject to change.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b pb-2">5. Return Policy</h2>
            <p className="mb-4">
              Please review our Return Policy posted on the Site prior to making any purchases. All returns must be made in accordance with the guidelines set forth in our Return Policy. Items must be unworn, unwashed, and have original tags attached to be eligible for a return or exchange.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b pb-2">6. Contact Information</h2>
            <p className="mb-4">
              In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
            </p>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mt-4">
              <p className="font-semibold text-slate-900">LUXE Legal Department</p>
              <p>Email address: legal@luxestore.com</p>
              <p>Phone: +1 (800) 555-LUXE</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
