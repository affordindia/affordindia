import React from "react";

const CancellationPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-[#1F1F1F]">
      {/* Title */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold border-b-4 border-[#B76E79] inline-block pb-1">
          Cancellation Policy 
        </h1>
      </div>

      {/* Intro */}
      <div className="bg-white shadow-md rounded-xl border border-gray-200">
        <div className="divide-y divide-gray-200">
          {/* Customer Cancellation */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              3. Cancellation by You (The Customer)
            </h2>
            <p className="text-sm leading-relaxed mb-3">
              You can cancel your Afford India order before it has been shipped.
              Simply log in to your account or get in touch with us. Once
              cancelled, a full refund will be issued via your original payment
              method.
            </p>
            <p className="text-sm text-red-600">
              Please note: Customized orders cannot be cancelled or refunded.
            </p>
          </div>

          {/* Company Cancellation */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              4. Cancellation by Afford India
            </h2>
            <p className="text-sm leading-relaxed">
              Sometimes, we may need to cancel an order due to product
              unavailability, technical glitches, or security reasons. If this
              happens, we’ll inform you immediately and initiate a full refund.
            </p>
          </div>

          {/* Philosophy */}
          <div className="p-6">
            <p className="text-sm leading-relaxed">
              At Afford India, we craft more than jewellery — we craft
              experiences! We want you to be thrilled with your purchase. But
              in the rare case that you change your mind or something isn’t
              quite right, we’re here to make things easy and stress-free for
              you.
            </p>
          </div>

          {/* Return & Exchange */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              Return & Exchange Made Simple
            </h2>
            <ul className="list-disc list-inside text-sm leading-relaxed space-y-1">
              <li>You didn’t love what you received</li>
              <li>You want a different piece/size or store credit</li>
              <li>You received a damaged or incorrect item</li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed">
              <strong>Return Policy:</strong> We offer a 7-day return policy for
              all unused and unworn items — no questions asked. This does not
              apply to personalised items. Refunds are processed after checking
              returned items. Any shipping charges (if paid) are non-refundable.
            </p>
          </div>

          {/* Return Process */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              Return Process
            </h2>
            <p className="text-sm leading-relaxed mb-2">
              You can initiate a return request from our website or contact our
              Customer Support team. Once booked, please be available for the
              reverse pick-up and answer calls from the delivery partner.
            </p>
            <p className="text-sm leading-relaxed mb-3">
              After passing the quality check, we will issue:
            </p>
            <ul className="list-disc list-inside text-sm leading-relaxed space-y-1">
              <li>A replacement</li>
              <li>A full refund (prepaid orders to original payment method)</li>
              <li>Store credit</li>
            </ul>
            <p className="text-xs mt-3 text-gray-600">
              For COD orders: Refunds will be made to the bank account in the
              name mentioned on the original billing details. Only the product
              amount is refundable. Shipping, gift wrap, COD charges, or customs
              fees are non-refundable.
            </p>
          </div>

          {/* Refunds */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              Refunds
            </h2>
            <p className="text-sm leading-relaxed">
              Refunds are processed once we receive the product in unused
              condition, with original packaging, tags, and invoice. Refunds are
              made via the original payment method or cheque (if the card used
              is no longer active). Processing time: 7–15 working days.
            </p>
          </div>

          {/* Cancellations */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              Cancellations
            </h2>
            <p className="text-sm leading-relaxed">
              To cancel an order, email us at{" "}
              <a
                href="mailto:shopshyle@gmail.com"
                className="text-[#B76E79] underline"
              >
                shopshyle@gmail.com
              </a>{" "}
              or WhatsApp us within 6 hours of placing the order.
            </p>
            <ul className="list-disc list-inside text-sm leading-relaxed mt-2 space-y-1">
              <li>If not dispatched: Full refund to original payment method</li>
              <li>
                If already shipped: Two-way shipping charges will be deducted,
                and the remaining refund will be processed once returned.
              </li>
            </ul>
            <p className="text-sm text-red-600 mt-2">
              Customized or made-to-order items cannot be cancelled or refunded.
            </p>
          </div>

          {/* Delivery Timelines */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              Delivery Timelines
            </h2>
            <p className="text-sm leading-relaxed">
              We usually ship all orders within 6–8 business days. For
              customised or made-to-order pieces, the timeline may be longer,
              but we’ll keep you informed.
            </p>
          </div>

          {/* Product Disclaimer */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              Please Note
            </h2>
            <p className="text-sm leading-relaxed">
              Our products are photographed under professional lighting. Slight
              differences may occur under normal lighting — that’s the beauty of
              handcrafted silver jewellery.
            </p>
          </div>

          {/* Wrong or Damaged Product */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              Received the Wrong or Damaged Product?
            </h2>
            <ul className="list-disc list-inside text-sm leading-relaxed space-y-1">
              <li>Contact Afford India within 3 days of receiving the order</li>
              <li>Do not use the product</li>
              <li>
                Send Order ID, clear photos, and issue details to{" "}
                <a
                  href="mailto:shopshyle@gmail.com"
                  className="text-[#B76E79] underline"
                >
                  shopshyle@gmail.com
                </a>{" "}
                or WhatsApp
              </li>
            </ul>
            <p className="text-sm leading-relaxed mt-2">
              Once verified, we’ll offer a free return, replacement, or refund —
              including shipping charges if it’s our mistake.
            </p>
          </div>

          {/* International Orders */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              International Orders
            </h2>
            <p className="text-sm leading-relaxed">
              Customs duties and taxes for deliveries outside India are not
              included in the product price. They are charged by your country’s
              customs and must be paid directly by you.
            </p>
          </div>

          {/* Help Section */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              Need Help?
            </h2>
            <p className="text-sm leading-relaxed">
              Email:{" "}
              <a
                href="mailto:shopshyle@gmail.com"
                className="text-[#B76E79] underline"
              >
                shopshyle@gmail.com
              </a>
              <br />
              Call/WhatsApp:{" "}
              <a href="tel:+918384069624" className="text-[#B76E79] underline">
                +91 8384069624
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
