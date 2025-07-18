<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;

class AboutController extends Controller
{
    public function index()
    {
        $aboutData = [
            'company' => [
                'name_ar' => 'متجر الأخضر',
                'name_en' => 'Green Store',
                'description_ar' => 'نحن متخصصون في توفير أفضل النباتات والخدمات البيئية منذ عام 2020. نهدف إلى جعل كل مكان أكثر خضرة وجمالاً.',
                'description_en' => 'We specialize in providing the best plants and environmental services since 2020. We aim to make every place greener and more beautiful.',
                'mission_ar' => 'مهمتنا هي نشر الوعي البيئي وتوفير أفضل النباتات والخدمات لعملائنا',
                'mission_en' => 'Our mission is to spread environmental awareness and provide the best plants and services to our customers',
                'vision_ar' => 'رؤيتنا أن نكون الرائدين في مجال النباتات والخدمات البيئية في المملكة',
                'vision_en' => 'Our vision is to be the leaders in plants and environmental services in the Kingdom',
                'founded_year' => 2020,
                'employees_count' => 50,
                'customers_served' => 5000,
                'projects_completed' => 1200,
            ],
            'values' => [
                [
                    'title_ar' => 'الجودة',
                    'title_en' => 'Quality',
                    'description_ar' => 'نلتزم بتقديم أعلى مستويات الجودة في جميع منتجاتنا وخدماتنا',
                    'description_en' => 'We are committed to providing the highest levels of quality in all our products and services',
                    'icon' => 'quality-icon.svg',
                ],
                [
                    'title_ar' => 'الاستدامة',
                    'title_en' => 'Sustainability',
                    'description_ar' => 'نؤمن بأهمية الحفاظ على البيئة والاستدامة في جميع أعمالنا',
                    'description_en' => 'We believe in the importance of environmental conservation and sustainability in all our work',
                    'icon' => 'sustainability-icon.svg',
                ],
                [
                    'title_ar' => 'الابتكار',
                    'title_en' => 'Innovation',
                    'description_ar' => 'نسعى دائماً للابتكار وتطوير حلول جديدة ومبتكرة',
                    'description_en' => 'We always strive for innovation and developing new and innovative solutions',
                    'icon' => 'innovation-icon.svg',
                ],
                [
                    'title_ar' => 'خدمة العملاء',
                    'title_en' => 'Customer Service',
                    'description_ar' => 'رضا عملائنا هو أولويتنا الأولى ونسعى لتقديم أفضل خدمة',
                    'description_en' => 'Customer satisfaction is our top priority and we strive to provide the best service',
                    'icon' => 'service-icon.svg',
                ],
            ],
            'team' => [
                [
                    'name_ar' => 'أحمد محمد',
                    'name_en' => 'Ahmed Mohammed',
                    'position_ar' => 'المدير العام',
                    'position_en' => 'General Manager',
                    'bio_ar' => 'خبرة 15 عام في مجال النباتات والتنسيق',
                    'bio_en' => '15 years of experience in plants and landscaping',
                    'image' => '/assets/images/team/ahmed.jpg',
                ],
                [
                    'name_ar' => 'فاطمة أحمد',
                    'name_en' => 'Fatima Ahmed',
                    'position_ar' => 'مديرة المبيعات',
                    'position_en' => 'Sales Manager',
                    'bio_ar' => 'متخصصة في خدمة العملاء والمبيعات',
                    'bio_en' => 'Specialist in customer service and sales',
                    'image' => '/assets/images/team/fatima.jpg',
                ],
                [
                    'name_ar' => 'محمد علي',
                    'name_en' => 'Mohammed Ali',
                    'position_ar' => 'خبير النباتات',
                    'position_en' => 'Plant Expert',
                    'bio_ar' => 'حاصل على شهادة في علم النبات والزراعة',
                    'bio_en' => 'Certified in botany and agriculture',
                    'image' => '/assets/images/team/mohammed.jpg',
                ],
            ],
            'contact' => [
                'address_ar' => 'الرياض، حي الملك فهد، شارع الأمير محمد بن عبدالعزيز',
                'address_en' => 'Riyadh, King Fahd District, Prince Mohammed bin Abdulaziz Street',
                'phone' => '+966 11 234 5678',
                'email' => 'info@greenstore.com',
                'working_hours_ar' => 'السبت - الخميس: 8:00 ص - 8:00 م',
                'working_hours_en' => 'Saturday - Thursday: 8:00 AM - 8:00 PM',
                'social_media' => [
                    'instagram' => 'https://instagram.com/greenstore_sa',
                    'twitter' => 'https://twitter.com/greenstore_sa',
                    'facebook' => 'https://facebook.com/greenstore.sa',
                    'whatsapp' => '+966501234567',
                ],
            ],
            'certifications' => [
                [
                    'name_ar' => 'شهادة الجودة ISO 9001',
                    'name_en' => 'ISO 9001 Quality Certificate',
                    'image' => '/assets/images/certifications/iso9001.jpg',
                ],
                [
                    'name_ar' => 'شهادة البيئة ISO 14001',
                    'name_en' => 'ISO 14001 Environmental Certificate',
                    'image' => '/assets/images/certifications/iso14001.jpg',
                ],
            ],
        ];

        return response()->json($aboutData);
    }

    public function contact(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        $contactMessage = ContactMessage::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'subject' => $request->subject,
            'message' => $request->message,
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Your message has been sent successfully. We will contact you soon.',
            'contact_id' => $contactMessage->id,
        ]);
    }
}