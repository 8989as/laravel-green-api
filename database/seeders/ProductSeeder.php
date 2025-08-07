<?php

namespace Database\Seeders;

use App\Models\Occasion;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name_en' => 'Red Roses Bouquet',
                'name_ar' => 'باقة ورد أحمر',
                'name_latin' => 'Rosa ruber',
                'description_en' => 'A beautiful bouquet of fresh red roses, perfect for romantic occasions.',
                'description_ar' => 'باقة جميلة من الورد الأحمر الطازج، مثالية للمناسبات الرومانسية.',
                'price' => 49.99,
                'discount_price' => 39.99,
                'discount_from' => '2024-03-01',
                'discount_to' => '2024-03-31',
                'has_variants' => true,
                'stock' => 50,
                'category_id' => 1,
            ],
            [
                'name_en' => 'White Orchid Plant',
                'name_ar' => 'نبات الأوركيد الأبيض',
                'name_latin' => 'Phalaenopsis amabilis',
                'description_en' => 'Elegant white orchid in a ceramic pot, perfect for home decoration.',
                'description_ar' => 'زهرة الأوركيد البيضاء الأنيقة في وعاء سيراميك، مثالية لتزيين المنزل.',
                'price' => 29.99,
                'stock' => 30,
                'has_variants' => false,
                'category_id' => 2,
            ],
            // Continuing with all products, adding category_id between 1-3 randomly
            [
                'name_en' => 'Pink Tulip Bouquet',
                'name_ar' => 'باقة التوليب الوردي',
                'name_latin' => 'Tulipa gesneriana',
                'description_en' => 'Fresh pink tulips arranged beautifully in a seasonal bouquet.',
                'description_ar' => 'زهور التوليب الوردية الطازجة مرتبة بشكل جميل في باقة موسمية.',
                'price' => 34.99,
                'stock' => 40,
                'has_variants' => false,
                'category_id' => 3,
            ],
            [
                'name_en' => 'Sunflower Bunch',
                'name_ar' => 'باقة عباد الشمس',
                'name_latin' => 'Helianthus annuus',
                'description_en' => 'Bright and cheerful sunflowers to brighten any room.',
                'description_ar' => 'زهور عباد الشمس المشرقة والمبهجة لإضاءة أي غرفة.',
                'price' => 24.99,
                'stock' => 45,
                'has_variants' => false,
                'category_id' => 1,
            ],
            [
                'name_en' => 'Purple Lilac',
                'name_ar' => 'الليلك البنفسجي',
                'name_latin' => 'Syringa vulgaris',
                'description_en' => 'Fragrant purple lilac branches, seasonal availability.',
                'description_ar' => 'أغصان الليلك البنفسجي العطرية، متوفرة موسمياً.',
                'price' => 27.99,
                'stock' => 25,
                'has_variants' => false,
                'category_id' => 2,
            ],
            [
                'name_en' => 'Peace Lily Plant',
                'name_ar' => 'نبات زنبق السلام',
                'name_latin' => 'Spathiphyllum',
                'description_en' => 'Air-purifying peace lily plant in decorative pot.',
                'description_ar' => 'نبات زنبق السلام المنقي للهواء في وعاء مزخرف.',
                'price' => 39.99,
                'stock' => 35,
                'has_variants' => false,
                'category_id' => 3,
            ],
            [
                'name_en' => 'Mixed Gerbera Bouquet',
                'name_ar' => 'باقة جيربيرا متنوعة',
                'name_latin' => 'Gerbera jamesonii',
                'description_en' => 'Colorful mix of gerbera daisies.',
                'description_ar' => 'مزيج ملون من زهور الجيربيرا.',
                'price' => 32.99,
                'stock' => 40,
                'has_variants' => true,
                'category_id' => 1,
            ],
            [
                'name_en' => 'Jasmine Plant',
                'name_ar' => 'نبات الياسمين',
                'name_latin' => 'Jasminum',
                'description_en' => 'Fragrant jasmine plant in hanging basket.',
                'description_ar' => 'نبات الياسمين العطري في سلة معلقة.',
                'price' => 28.99,
                'stock' => 20,
                'has_variants' => false,
                'category_id' => 2,
            ],
            [
                'name_en' => 'Blue Hydrangea',
                'name_ar' => 'هيدرنجيا زرقاء',
                'name_latin' => 'Hydrangea macrophylla',
                'description_en' => 'Beautiful blue hydrangea in ceramic pot.',
                'description_ar' => 'هيدرنجيا زرقاء جميلة في وعاء سيراميك.',
                'price' => 45.99,
                'stock' => 15,
                'has_variants' => false,
                'category_id' => 3,
            ],
            [
                'name_en' => 'Pink Carnations',
                'name_ar' => 'قرنفل وردي',
                'name_latin' => 'Dianthus caryophyllus',
                'description_en' => 'Sweet-scented pink carnation bouquet.',
                'description_ar' => 'باقة من القرنفل الوردي العطري.',
                'price' => 22.99,
                'stock' => 55,
                'has_variants' => false,
                'category_id' => 1,
            ],
            [
                'name_en' => 'Yellow Daffodils',
                'name_ar' => 'النرجس الأصفر',
                'name_latin' => 'Narcissus',
                'description_en' => 'Spring daffodils in seasonal arrangement.',
                'description_ar' => 'زهور النرجس الربيعية في تنسيق موسمي.',
                'price' => 19.99,
                'stock' => 60,
                'has_variants' => false,
                'category_id' => 2,
            ],
            [
                'name_en' => 'Purple Iris Bouquet',
                'name_ar' => 'باقة السوسن البنفسجي',
                'name_latin' => 'Iris germanica',
                'description_en' => 'Elegant purple iris flowers arrangement.',
                'description_ar' => 'تنسيق أنيق من زهور السوسن البنفسجي.',
                'price' => 26.99,
                'stock' => 35,
                'has_variants' => false,
                'category_id' => 3,
            ],
            [
                'name_en' => 'Chrysanthemum Plant',
                'name_ar' => 'نبات الأقحوان',
                'name_latin' => 'Chrysanthemum morifolium',
                'description_en' => 'Colorful chrysanthemum plant in pot.',
                'description_ar' => 'نبات الأقحوان الملون في أصيص.',
                'price' => 23.99,
                'stock' => 40,
                'has_variants' => false,
                'category_id' => 1,
            ],
            [
                'name_en' => 'White Lily Bouquet',
                'name_ar' => 'باقة الزنبق الأبيض',
                'name_latin' => 'Lilium candidum',
                'description_en' => 'Pure white lily bouquet for special occasions.',
                'description_ar' => 'باقة من الزنبق الأبيض النقي للمناسبات الخاصة.',
                'price' => 42.99,
                'stock' => 30,
                'has_variants' => true,
                'category_id' => 2,
            ],
            [
                'name_en' => 'Anthurium Plant',
                'name_ar' => 'نبات الأنثوريوم',
                'name_latin' => 'Anthurium andraeanum',
                'description_en' => 'Red anthurium plant in modern pot.',
                'description_ar' => 'نبات الأنثوريوم الأحمر في وعاء عصري.',
                'price' => 36.99,
                'stock' => 25,
                'has_variants' => false,
                'category_id' => 3,
            ],
            [
                'name_en' => 'Mixed Wildflowers',
                'name_ar' => 'زهور برية متنوعة',
                'name_latin' => 'Various species',
                'description_en' => 'Seasonal mix of colorful wildflowers.',
                'description_ar' => 'مزيج موسمي من الزهور البرية الملونة.',
                'price' => 29.99,
                'stock' => 45,
                'has_variants' => true,
                'category_id' => 1,
            ],
            [
                'name_en' => 'Bamboo Plant',
                'name_ar' => 'نبات البامبو',
                'name_latin' => 'Bambusa vulgaris',
                'description_en' => 'Lucky bamboo arrangement in glass vase.',
                'description_ar' => 'تنسيق البامبو المحظوظ في مزهرية زجاجية.',
                'price' => 25.99,
                'stock' => 50,
                'has_variants' => false,
                'category_id' => 2,
            ],
            [
                'name_en' => 'Dahlia Bouquet',
                'name_ar' => 'باقة الداليا',
                'name_latin' => 'Dahlia pinnata',
                'description_en' => 'Mixed dahlia flowers in seasonal colors.',
                'description_ar' => 'زهور الداليا المتنوعة بألوان موسمية.',
                'price' => 38.99,
                'stock' => 35,
                'has_variants' => true,
                'category_id' => 3,
            ],
            [
                'name_en' => 'Gardenia Plant',
                'name_ar' => 'نبات الجاردينيا',
                'name_latin' => 'Gardenia jasminoides',
                'description_en' => 'Fragrant gardenia plant in decorative pot.',
                'description_ar' => 'نبات الجاردينيا العطري في وعاء مزخرف.',
                'price' => 44.99,
                'stock' => 20,
                'has_variants' => false,
                'category_id' => 1,
            ],
            [
                'name_en' => 'Mixed Roses Premium',
                'name_ar' => 'باقة ورد متنوعة فاخرة',
                'name_latin' => 'Rosa hybrid',
                'description_en' => 'Premium selection of mixed color roses.',
                'description_ar' => 'تشكيلة فاخرة من الورود متعددة الألوان.',
                'price' => 89.99,
                'discount_price' => 79.99,
                'discount_from' => '2024-03-01',
                'discount_to' => '2024-03-31',
                'has_variants' => true,
                'stock' => 25,
                'category_id' => 2,
            ],
            // Gift Products
            [
                'name_en' => 'Birthday Celebration Bouquet',
                'name_ar' => 'باقة احتفال عيد الميلاد',
                'name_latin' => 'Mixed flowers',
                'description_en' => 'Colorful birthday bouquet with balloons and ribbon.',
                'description_ar' => 'باقة عيد ميلاد ملونة مع بالونات وشريط.',
                'price' => 65.99,
                'stock' => 30,
                'has_variants' => false,
                'category_id' => 1,
                'is_gift' => true,
            ],
            [
                'name_en' => 'Wedding White Roses',
                'name_ar' => 'ورود بيضاء للزفاف',
                'name_latin' => 'Rosa alba',
                'description_en' => 'Elegant white roses perfect for wedding celebrations.',
                'description_ar' => 'ورود بيضاء أنيقة مثالية لاحتفالات الزفاف.',
                'price' => 120.99,
                'stock' => 20,
                'has_variants' => true,
                'category_id' => 2,
                'is_gift' => true,
            ],
            [
                'name_en' => 'Graduation Success Plant',
                'name_ar' => 'نبات النجاح للتخرج',
                'name_latin' => 'Ficus benjamina',
                'description_en' => 'Lucky plant to celebrate graduation achievements.',
                'description_ar' => 'نبات الحظ للاحتفال بإنجازات التخرج.',
                'price' => 45.99,
                'stock' => 25,
                'has_variants' => false,
                'category_id' => 3,
                'is_gift' => true,
            ],
            [
                'name_en' => 'Mother\'s Day Special',
                'name_ar' => 'باقة خاصة لعيد الأم',
                'name_latin' => 'Mixed seasonal',
                'description_en' => 'Beautiful arrangement to honor mothers.',
                'description_ar' => 'تنسيق جميل لتكريم الأمهات.',
                'price' => 75.99,
                'discount_price' => 65.99,
                'discount_from' => '2024-03-01',
                'discount_to' => '2024-03-31',
                'stock' => 40,
                'has_variants' => false,
                'category_id' => 1,
                'is_gift' => true,
            ],
            [
                'name_en' => 'Father\'s Day Succulent Set',
                'name_ar' => 'مجموعة عصاريات لعيد الأب',
                'name_latin' => 'Various succulents',
                'description_en' => 'Low-maintenance succulent collection for dads.',
                'description_ar' => 'مجموعة عصاريات سهلة العناية للآباء.',
                'price' => 55.99,
                'stock' => 35,
                'has_variants' => false,
                'category_id' => 2,
                'is_gift' => true,
            ],
            [
                'name_en' => 'Valentine\'s Love Bouquet',
                'name_ar' => 'باقة الحب لعيد الحب',
                'name_latin' => 'Rosa rubra',
                'description_en' => 'Romantic red roses for Valentine\'s Day.',
                'description_ar' => 'ورود حمراء رومانسية لعيد الحب.',
                'price' => 85.99,
                'stock' => 50,
                'has_variants' => true,
                'category_id' => 3,
                'is_gift' => true,
            ],
            [
                'name_en' => 'New Baby Pink Arrangement',
                'name_ar' => 'تنسيق وردي للمولود الجديد',
                'name_latin' => 'Mixed pink flowers',
                'description_en' => 'Soft pink flowers to welcome a new baby girl.',
                'description_ar' => 'زهور وردية ناعمة لاستقبال المولودة الجديدة.',
                'price' => 60.99,
                'stock' => 30,
                'has_variants' => false,
                'category_id' => 1,
                'is_gift' => true,
            ],
            [
                'name_en' => 'New Baby Blue Arrangement',
                'name_ar' => 'تنسيق أزرق للمولود الجديد',
                'name_latin' => 'Mixed blue flowers',
                'description_en' => 'Gentle blue flowers to welcome a new baby boy.',
                'description_ar' => 'زهور زرقاء لطيفة لاستقبال المولود الجديد.',
                'price' => 60.99,
                'stock' => 30,
                'has_variants' => false,
                'category_id' => 2,
                'is_gift' => true,
            ],
            [
                'name_en' => 'Anniversary Golden Roses',
                'name_ar' => 'ورود ذهبية للذكرى السنوية',
                'name_latin' => 'Rosa aurea',
                'description_en' => 'Golden roses to celebrate love anniversaries.',
                'description_ar' => 'ورود ذهبية للاحتفال بذكرى الحب السنوية.',
                'price' => 95.99,
                'stock' => 25,
                'has_variants' => false,
                'category_id' => 3,
                'is_gift' => true,
            ],
            [
                'name_en' => 'Congratulations Mixed Bouquet',
                'name_ar' => 'باقة تهنئة متنوعة',
                'name_latin' => 'Mixed celebration',
                'description_en' => 'Bright and cheerful bouquet for any celebration.',
                'description_ar' => 'باقة مشرقة ومبهجة لأي احتفال.',
                'price' => 52.99,
                'stock' => 40,
                'has_variants' => true,
                'category_id' => 1,
                'is_gift' => true,
            ],
        ];

        foreach ($products as $productData) {
            $product = Product::create(array_merge($productData, [
                'is_active' => true,
                'in_stock' => $productData['stock'] > 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]));

            // Associate gift products with occasions
            if (isset($productData['is_gift']) && $productData['is_gift']) {
                $this->attachOccasionsToGiftProduct($product, $productData['name_en']);
            }
        }
    }

    /**
     * Attach appropriate occasions to gift products based on their names
     */
    private function attachOccasionsToGiftProduct($product, $productName)
    {
        $occasionMappings = [
            'Birthday' => ['birthday'],
            'Wedding' => ['wedding'],
            'Graduation' => ['graduation'],
            'Mother\'s Day' => ['mothers-day'],
            'Father\'s Day' => ['fathers-day'],
            'Valentine\'s' => ['valentines-day'],
            'New Baby' => ['new-baby'],
            'Anniversary' => ['anniversary'],
            'Congratulations' => ['birthday', 'graduation', 'anniversary'], // Multi-occasion gift
        ];

        foreach ($occasionMappings as $keyword => $occasionSlugs) {
            if (stripos($productName, $keyword) !== false) {
                foreach ($occasionSlugs as $slug) {
                    $occasion = Occasion::where('slug', $slug)->first();
                    if ($occasion) {
                        $product->occasions()->attach($occasion->id);
                    }
                }
                break; // Only attach the first matching occasion set
            }
        }
    }
}
