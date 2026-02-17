// import React from "react";
// import { Link } from "react-router-dom";
// import "../styles/Support.css";

// export default function Support() {
//   return (
//     <div className="sp-page">
//       <div className="sp-container">
//         <div className="sp-header card">
//           <div>
//             <h1>Support</h1>
//             <p>Get help with booking, payments, cancellations, and account issues.</p>
//           </div>

//           <Link to="/home" className="sp-btn sp-btn-outline">
//             ← Back to Home
//           </Link>
//         </div>

//         <div className="sp-grid">
//           <div className="card">
//             <h2>FAQs</h2>

//             <details className="sp-faq">
//               <summary>How do I book a slot?</summary>
//               <div className="sp-faq-body">
//                 Go to <b>Find Cricsal</b>, select a ground, choose date/time, then confirm booking.
//               </div>
//             </details>

//             <details className="sp-faq">
//               <summary>Can I cancel or reschedule?</summary>
//               <div className="sp-faq-body">
//                 Open <b>My Bookings</b>. If cancellation/reschedule is allowed by policy, you will see options there.
//               </div>
//             </details>

//             <details className="sp-faq">
//               <summary>Where do I see my booking history?</summary>
//               <div className="sp-faq-body">
//                 Your full booking history is available on the <b>My Bookings</b> page.
//               </div>
//             </details>

//             <div className="sp-actions">
//               <Link to="/find-cricsal" className="sp-btn sp-btn-primary">
//                 Find Cricsal
//               </Link>
//               <Link to="/bookings" className="sp-btn sp-btn-outline">
//                 My Bookings
//               </Link>
//             </div>
//           </div>

//           <div className="card">
//             <h2>Contact</h2>
//             <p className="sp-muted">You can mention any problem you faced.</p>

//             <form className="sp-form" onSubmit={(e) => e.preventDefault()}>
//               <label>
//                 Name
//                 <input placeholder="Your name" />
//               </label>

//               <label>
//                 Email
//                 <input placeholder="your@email.com" />
//               </label>

//               <label>
//                 Message
//                 <textarea rows="4" placeholder="Describe your issue..." />
//               </label>

//               <button className="sp-btn sp-btn-primary" type="submit">
//                 Submit Request
//               </button>
//             </form>

//             <div className="sp-note">
//               (Later you can connect this to backend: <b>/api/support</b>.)
//             </div>
//           </div>
//         </div>

//         <footer className="sp-footer">
//           © 2026 CricBook • <Link to="/">Terms</Link> • <Link to="/">Privacy</Link>
//         </footer>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Support() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // later connect to backend /api/support
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto w-full max-w-6xl space-y-5">
        
        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-100">
                Help Center
              </div>

              <h1 className="mt-3 text-2xl font-bold text-gray-900">
                Support
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Get help with booking, payments, cancellations, and account issues.
              </p>
            </div>

            <Link
              to="/home"
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-5 lg:grid-cols-2">

          {/* FAQs */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <h2 className="text-lg font-semibold text-gray-900">FAQs</h2>

            <div className="mt-4 space-y-3">
              <details className="group rounded-xl border border-gray-200 p-4">
                <summary className="cursor-pointer font-semibold text-gray-900">
                  How do I book a slot?
                </summary>
                <p className="mt-2 text-sm text-gray-600">
                  Go to <b>Find Cricsal</b>, select a ground, choose date/time, then confirm booking.
                </p>
              </details>

              <details className="group rounded-xl border border-gray-200 p-4">
                <summary className="cursor-pointer font-semibold text-gray-900">
                  Can I cancel or reschedule?
                </summary>
                <p className="mt-2 text-sm text-gray-600">
                  Open <b>My Bookings</b>. If cancellation/reschedule is allowed by policy, options will appear there.
                </p>
              </details>

              <details className="group rounded-xl border border-gray-200 p-4">
                <summary className="cursor-pointer font-semibold text-gray-900">
                  Where do I see my booking history?
                </summary>
                <p className="mt-2 text-sm text-gray-600">
                  Your full booking history is available on the <b>My Bookings</b> page.
                </p>
              </details>
            </div>

            <div className="mt-5 flex gap-3">
              <Link
                to="/find-cricsal"
                className="rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition"
              >
                Find Cricsal
              </Link>

              <Link
                to="/bookings"
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
              >
                My Bookings
              </Link>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
            <p className="mt-1 text-sm text-gray-600">
              Tell us about the issue you faced.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">

              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Name
                </label>
                <input
                  placeholder="Your name"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Email
                </label>
                <input
                  placeholder="your@email.com"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Message
                </label>
                <textarea
                  rows="4"
                  placeholder="Describe your issue..."
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {submitted && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  Support request submitted! We will contact you soon.
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white hover:bg-green-800 transition"
              >
                Submit Request
              </button>
            </form>

            <div className="mt-4 text-xs text-gray-500">
              (Later you can connect this to backend: <b>/api/support</b>)
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 text-center text-xs text-gray-500">
          © 2026 CricBook •{" "}
          <Link className="font-semibold hover:underline" to="/">
            Terms
          </Link>{" "}
          •{" "}
          <Link className="font-semibold hover:underline" to="/">
            Privacy
          </Link>
        </div>
      </div>
    </div>
  );
}
