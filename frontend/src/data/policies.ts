export interface PolicySection {
  title: string;
  content: string;
}

export const termsData = {
  title: "Terms of Service",
  lastUpdated: "January 2025",
  sections: [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing and using the Buda Ko Achar website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.",
    },
    {
      title: "2. Products and Orders",
      content:
        "All products listed on our website are subject to availability. We reserve the right to discontinue any product at any time. Prices for all products are subject to change without notice.",
    },
    {
      title: "3. Pricing and Payment",
      content:
        "All prices are listed in Nepali Rupees (NRS). Payment must be made at the time of ordering. We accept various payment methods as listed on our checkout page.",
    },
    {
      title: "4. Shipping and Delivery",
      content:
        "We ship to addresses within Nepal. Delivery times may vary depending on your location. We are not responsible for delays caused by shipping carriers or unforeseen circumstances.",
    },
    {
      title: "5. Returns and Refunds",
      content:
        "Due to the nature of our products (food items), we generally do not accept returns. If you receive a damaged or defective product, please contact us within 7 days of delivery for a replacement or refund.",
    },
    {
      title: "6. Intellectual Property",
      content:
        "All content on this website, including text, images, logos, and trademarks, is the property of Buda Ko Achar and is protected by applicable intellectual property laws.",
    },
    {
      title: "7. Limitation of Liability",
      content:
        "Buda Ko Achar shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.",
    },
    {
      title: "8. Changes to Terms",
      content:
        "We reserve the right to update these terms at any time. Changes will be effective immediately upon posting on this page.",
    },
    {
      title: "9. Contact Information",
      content:
        "For questions about these Terms of Service, please contact us at info@budakoachar.com.",
    },
  ] satisfies PolicySection[],
};

export const privacyData = {
  title: "Privacy Policy",
  lastUpdated: "January 2025",
  sections: [
    {
      title: "1. Information We Collect",
      content:
        "We collect information you provide directly to us, such as when you create an account, place an order, subscribe to our newsletter, or contact us. This may include your name, email address, phone number, shipping address, and payment information.",
    },
    {
      title: "2. How We Use Your Information",
      content:
        "We use the information we collect to process transactions, send order-related communications, respond to your comments and questions, provide customer support, send promotional communications (with your consent), and improve our services.",
    },
    {
      title: "3. Information Sharing",
      content:
        "We do not sell, trade, or otherwise transfer your personal information to outside parties except to trusted third parties who assist us in operating our website, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.",
    },
    {
      title: "4. Data Security",
      content:
        "We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.",
    },
    {
      title: "5. Cookies",
      content:
        "We use cookies to enhance your experience on our website. You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies through your browser settings.",
    },
    {
      title: "6. Your Rights",
      content:
        "You have the right to access, correct, or delete your personal information. You can also opt out of receiving marketing communications from us at any time by contacting us or using the unsubscribe link in our emails.",
    },
    {
      title: "7. Changes to This Policy",
      content:
        "We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated effective date.",
    },
    {
      title: "8. Contact Us",
      content:
        "If you have any questions about this Privacy Policy, please contact us at info@budakoachar.com.",
    },
  ] satisfies PolicySection[],
};
