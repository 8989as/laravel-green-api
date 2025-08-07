<?php

namespace Database\Seeders;

use App\Models\Occasion;
use Illuminate\Database\Seeder;

class OccasionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $occasions = [
            [
                'name_ar' => 'عيد ميلاد',
                'name_en' => 'Birthday',
                'slug' => 'birthday',
                'icon' => '🎂',
                'is_active' => true,
            ],
            [
                'name_ar' => 'زواج',
                'name_en' => 'Wedding',
                'slug' => 'wedding',
                'icon' => '💒',
                'is_active' => true,
            ],
            [
                'name_ar' => 'تخرج',
                'name_en' => 'Graduation',
                'slug' => 'graduation',
                'icon' => '🎓',
                'is_active' => true,
            ],
            [
                'name_ar' => 'عيد الأم',
                'name_en' => 'Mother\'s Day',
                'slug' => 'mothers-day',
                'icon' => '🌹',
                'is_active' => true,
            ],
            [
                'name_ar' => 'عيد الأب',
                'name_en' => 'Father\'s Day',
                'slug' => 'fathers-day',
                'icon' => '👔',
                'is_active' => true,
            ],
            [
                'name_ar' => 'عيد الحب',
                'name_en' => 'Valentine\'s Day',
                'slug' => 'valentines-day',
                'icon' => '💝',
                'is_active' => true,
            ],
            [
                'name_ar' => 'مولود جديد',
                'name_en' => 'New Baby',
                'slug' => 'new-baby',
                'icon' => '👶',
                'is_active' => true,
            ],
            [
                'name_ar' => 'ذكرى سنوية',
                'name_en' => 'Anniversary',
                'slug' => 'anniversary',
                'icon' => '💍',
                'is_active' => true,
            ],
        ];

        foreach ($occasions as $occasion) {
            Occasion::create($occasion);
        }
    }
}
