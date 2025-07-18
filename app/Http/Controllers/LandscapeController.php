<?php

namespace App\Http\Controllers;

use App\Models\LandscapeBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LandscapeController extends Controller
{
    public function index()
    {
        $services = [
            [
                'id' => 1,
                'name_ar' => 'تصميم الحدائق المنزلية',
                'name_en' => 'Home Garden Design',
                'description_ar' => 'تصميم وتنسيق الحدائق المنزلية بأحدث الطرق',
                'description_en' => 'Design and landscaping of home gardens with modern methods',
                'price_from' => 5000,
                'image' => '/assets/images/services/home-garden.jpg',
            ],
            [
                'id' => 2,
                'name_ar' => 'تنسيق الحدائق التجارية',
                'name_en' => 'Commercial Landscaping',
                'description_ar' => 'تنسيق وصيانة الحدائق للمباني التجارية والمكاتب',
                'description_en' => 'Landscaping and maintenance for commercial buildings and offices',
                'price_from' => 15000,
                'image' => '/assets/images/services/commercial-landscape.jpg',
            ],
            [
                'id' => 3,
                'name_ar' => 'أنظمة الري الذكية',
                'name_en' => 'Smart Irrigation Systems',
                'description_ar' => 'تركيب وصيانة أنظمة الري الذكية والموفرة للمياه',
                'description_en' => 'Installation and maintenance of smart and water-saving irrigation systems',
                'price_from' => 3000,
                'image' => '/assets/images/services/irrigation.jpg',
            ],
            [
                'id' => 4,
                'name_ar' => 'صيانة الحدائق',
                'name_en' => 'Garden Maintenance',
                'description_ar' => 'خدمات صيانة دورية للحدائق والنباتات',
                'description_en' => 'Regular maintenance services for gardens and plants',
                'price_from' => 500,
                'image' => '/assets/images/services/maintenance.jpg',
            ],
        ];

        return response()->json([
            'services' => $services,
        ]);
    }

    public function submitBooking(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'service_id' => 'required|integer',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'preferred_date' => 'required|date|after:today',
            'preferred_time' => 'required|string',
            'garden_size' => 'nullable|string|max:100',
            'budget_range' => 'nullable|string|max:100',
            'special_requirements' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $booking = LandscapeBooking::create([
            'booking_id' => 'LB' . date('Ymd') . rand(1000, 9999),
            'service_id' => $request->service_id,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'city' => $request->city,
            'preferred_date' => $request->preferred_date,
            'preferred_time' => $request->preferred_time,
            'garden_size' => $request->garden_size,
            'budget_range' => $request->budget_range,
            'special_requirements' => $request->special_requirements,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking submitted successfully. We will contact you soon.',
            'booking' => $booking,
        ]);
    }

    public function getBookingStatus(Request $request)
    {
        $bookingId = $request->input('booking_id');
        
        $booking = LandscapeBooking::where('booking_id', $bookingId)->first();
        
        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'booking' => $booking,
        ]);
    }

    public function getPortfolio()
    {
        $portfolio = [
            [
                'id' => 1,
                'title_ar' => 'حديقة فيلا الرياض',
                'title_en' => 'Riyadh Villa Garden',
                'description_ar' => 'تصميم وتنفيذ حديقة فيلا سكنية بمساحة 500 متر مربع',
                'description_en' => 'Design and implementation of a residential villa garden with 500 sqm',
                'before_image' => '/assets/images/portfolio/project1-before.jpg',
                'after_image' => '/assets/images/portfolio/project1-after.jpg',
                'category' => 'residential',
                'completion_date' => '2024-12-15',
            ],
            [
                'id' => 2,
                'title_ar' => 'مجمع تجاري - جدة',
                'title_en' => 'Commercial Complex - Jeddah',
                'description_ar' => 'تنسيق المساحات الخضراء لمجمع تجاري كبير',
                'description_en' => 'Landscaping green spaces for a large commercial complex',
                'before_image' => '/assets/images/portfolio/project2-before.jpg',
                'after_image' => '/assets/images/portfolio/project2-after.jpg',
                'category' => 'commercial',
                'completion_date' => '2024-11-20',
            ],
        ];

        return response()->json([
            'portfolio' => $portfolio,
        ]);
    }
}