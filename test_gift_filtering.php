<?php

// Simple test script to verify gift filtering functionality
// Run this after seeding: php test_gift_filtering.php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Occasion;
use App\Models\Product;

echo "=== Gift Filtering Test ===\n\n";

// Test 1: Get all gift products
echo "1. All Gift Products:\n";
$giftProducts = Product::where('is_gift', true)->with('occasions')->get();
echo "Found {$giftProducts->count()} gift products\n";

foreach ($giftProducts as $product) {
    echo "- {$product->name_en} (Price: {$product->price})\n";
    if ($product->occasions->count() > 0) {
        echo '  Occasions: '.$product->occasions->pluck('name_en')->join(', ')."\n";
    }
}

echo "\n";

// Test 2: Get all occasions
echo "2. All Occasions:\n";
$occasions = Occasion::where('is_active', true)->get();
echo "Found {$occasions->count()} occasions\n";

foreach ($occasions as $occasion) {
    $productCount = $occasion->products()->count();
    echo "- {$occasion->name_en} ({$occasion->icon}) - {$productCount} products\n";
}

echo "\n";

// Test 3: Filter gifts by specific occasion (Birthday)
echo "3. Birthday Gift Products:\n";
$birthdayOccasion = Occasion::where('slug', 'birthday')->first();
if ($birthdayOccasion) {
    $birthdayGifts = Product::where('is_gift', true)
        ->whereHas('occasions', function ($query) use ($birthdayOccasion) {
            $query->where('occasions.id', $birthdayOccasion->id);
        })
        ->get();

    echo "Found {$birthdayGifts->count()} birthday gifts\n";
    foreach ($birthdayGifts as $gift) {
        echo "- {$gift->name_en} (Price: {$gift->price})\n";
    }
} else {
    echo "Birthday occasion not found\n";
}

echo "\n";

// Test 4: Test the filter scope
echo "4. Testing Filter Scope:\n";
$filteredProducts = Product::where('is_gift', true)
    ->filter(['occasion' => $birthdayOccasion->id ?? 1])
    ->get();

echo "Filter scope returned {$filteredProducts->count()} products\n";

echo "\n=== Test Complete ===\n";
