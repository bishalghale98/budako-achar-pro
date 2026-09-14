<?php

namespace Database\Seeders;

use App\Enums\PageStatus;
use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        Page::updateOrCreate(
            ['slug' => 'terms-of-service'],
            [
                'title' => 'Terms of Service',
                'short_description' => 'Terms and conditions for using the Buda Ko Achar website and services.',
                'status' => PageStatus::Published,
                'published_at' => now()->subMonths(8),
                'seo_title' => 'Terms of Service | Buda Ko Achar',
                'seo_description' => 'Terms and conditions for using the Buda Ko Achar website and services.',
                'content' => $this->buildTermsContent(),
            ]
        );

        Page::updateOrCreate(
            ['slug' => 'privacy-policy'],
            [
                'title' => 'Privacy Policy',
                'short_description' => 'How we collect, use, and protect your personal information.',
                'status' => PageStatus::Published,
                'published_at' => now()->subMonths(8),
                'seo_title' => 'Privacy Policy | Buda Ko Achar',
                'seo_description' => 'How we collect, use, and protect your personal information.',
                'content' => $this->buildPrivacyContent(),
            ]
        );
    }

    private function buildTermsContent(): array
    {
        $sections = [
            ['1. Acceptance of Terms', 'By accessing and using the Buda Ko Achar website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.'],
            ['2. Products and Orders', 'All products listed on our website are subject to availability. We reserve the right to discontinue any product at any time. Prices for all products are subject to change without notice.'],
            ['3. Pricing and Payment', 'All prices are listed in Nepali Rupees (NRS). Payment must be made at the time of ordering. We accept various payment methods as listed on our checkout page.'],
            ['4. Shipping and Delivery', 'We ship to addresses within Nepal. Delivery times may vary depending on your location. We are not responsible for delays caused by shipping carriers or unforeseen circumstances.'],
            ['5. Returns and Refunds', 'Due to the nature of our products (food items), we generally do not accept returns. If you receive a damaged or defective product, please contact us within 7 days of delivery for a replacement or refund.'],
            ['6. Intellectual Property', 'All content on this website, including text, images, logos, and trademarks, is the property of Buda Ko Achar and is protected by applicable intellectual property laws.'],
            ['7. Limitation of Liability', 'Buda Ko Achar shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.'],
            ['8. Changes to Terms', 'We reserve the right to update these terms at any time. Changes will be effective immediately upon posting on this page.'],
            ['9. Contact Information', 'For questions about these Terms of Service, please contact us at info@budakoachar.com.'],
        ];

        return $this->buildTiptapDoc($sections);
    }

    private function buildPrivacyContent(): array
    {
        $sections = [
            ['1. Information We Collect', 'We collect information you provide directly to us, such as when you create an account, place an order, subscribe to our newsletter, or contact us. This may include your name, email address, phone number, shipping address, and payment information.'],
            ['2. How We Use Your Information', 'We use the information we collect to process transactions, send order-related communications, respond to your comments and questions, provide customer support, send promotional communications (with your consent), and improve our services.'],
            ['3. Information Sharing', 'We do not sell, trade, or otherwise transfer your personal information to outside parties except to trusted third parties who assist us in operating our website, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.'],
            ['4. Data Security', 'We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.'],
            ['5. Cookies', 'We use cookies to enhance your experience on our website. You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies through your browser settings.'],
            ['6. Your Rights', 'You have the right to access, correct, or delete your personal information. You can also opt out of receiving marketing communications from us at any time by contacting us or using the unsubscribe link in our emails.'],
            ['7. Changes to This Policy', 'We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated effective date.'],
            ['8. Contact Us', 'If you have any questions about this Privacy Policy, please contact us at info@budakoachar.com.'],
        ];

        return $this->buildTiptapDoc($sections);
    }

    private function buildTiptapDoc(array $sections): array
    {
        $content = [];

        foreach ($sections as [$title, $text]) {
            $content[] = [
                'type' => 'heading',
                'attrs' => ['level' => 2],
                'content' => [
                    ['type' => 'text', 'text' => $title],
                ],
            ];

            $content[] = [
                'type' => 'paragraph',
                'content' => [
                    ['type' => 'text', 'text' => $text],
                ],
            ];
        }

        return [
            'type' => 'doc',
            'content' => $content,
        ];
    }
}
