# Gift System Setup Guide

This guide explains how to set up and test the gift filtering system with occasions.

## Database Setup

### 1. Run Migrations
```bash
php artisan migrate
```

This will create:
- `occasions` table
- `product_occasions` pivot table

### 2. Seed Data
```bash
# Seed occasions and gift products
php artisan db:seed --class=GiftSystemSeeder

# Or seed individually
php artisan db:seed --class=OccasionSeeder
php artisan db:seed --class=ProductSeeder
```

## What Gets Created

### Occasions
- Birthday (عيد ميلاد) 🎂
- Wedding (زواج) 💒
- Graduation (تخرج) 🎓
- Mother's Day (عيد الأم) 🌹
- Father's Day (عيد الأب) 👔
- Valentine's Day (عيد الحب) 💝
- New Baby (مولود جديد) 👶
- Anniversary (ذكرى سنوية) 💍

### Gift Products
- Birthday Celebration Bouquet → Birthday
- Wedding White Roses → Wedding
- Graduation Success Plant → Graduation
- Mother's Day Special → Mother's Day
- Father's Day Succulent Set → Father's Day
- Valentine's Love Bouquet → Valentine's Day
- New Baby Pink/Blue Arrangements → New Baby
- Anniversary Golden Roses → Anniversary
- Congratulations Mixed Bouquet → Multiple occasions

## API Usage

### Get All Gifts
```javascript
GET /api/gifts
```

Response includes:
```json
{
  "products": [...],
  "occasions": [...],
  "categories": [...],
  "sizes": [...],
  "colors": [...]
}
```

### Filter Gifts by Occasion
```javascript
GET /api/gifts?occasion=1
```

### Filter Gifts by Price Range
```javascript
GET /api/gifts?min_price=50&max_price=100
```

### Combined Filters
```javascript
GET /api/gifts?occasion=1&min_price=50&max_price=100
```

## Frontend Integration

### Using the Updated SideBar Component

```jsx
import SideBar from './SideBar/SideBar';

// For gift products
<SideBar
  occasions={occasions}
  priceRange={{ min: 0, max: 200 }}
  isGift={true}
  onFilterChange={handleFilterChange}
  onApplyFilters={handleApplyFilters}
  initialFilters={{
    occasions: [],
    priceRange: [0, 200]
  }}
/>
```

### Filter Object Structure
```javascript
{
  occasions: [1, 2], // Array of occasion IDs
  priceRange: [50, 150] // [min, max] price range
}
```

## Testing

### 1. Test Database Setup
```bash
php test_gift_filtering.php
```

This will verify:
- Gift products are created
- Occasions are created
- Products are properly associated with occasions
- Filter scope works correctly

### 2. Test API Endpoints
```bash
# Test gifts endpoint
curl http://your-app.test/api/gifts

# Test occasion filtering
curl http://your-app.test/api/gifts?occasion=1

# Test price filtering
curl http://your-app.test/api/gifts?min_price=50&max_price=100
```

## Model Relationships

### Product Model
```php
public function occasions()
{
    return $this->belongsToMany(Occasion::class, 'product_occasions');
}
```

### Occasion Model
```php
public function products()
{
    return $this->belongsToMany(Product::class, 'product_occasions');
}
```

## Filter Scope Usage

The Product model includes a filter scope that handles occasion filtering:

```php
Product::where('is_gift', true)
    ->filter(['occasion' => 1])
    ->get();
```

## Troubleshooting

### Common Issues

1. **Occasions not showing**: Make sure `OccasionSeeder` ran successfully
2. **Products not filtered**: Check that gift products have `is_gift = true`
3. **No associations**: Verify the `product_occasions` pivot table has data
4. **API errors**: Ensure the `occasions` relationship is loaded in the controller

### Verify Setup
```php
// Check if occasions exist
$occasions = \App\Models\Occasion::count();
echo "Occasions: {$occasions}";

// Check if gift products exist
$gifts = \App\Models\Product::where('is_gift', true)->count();
echo "Gift products: {$gifts}";

// Check associations
$associations = \DB::table('product_occasions')->count();
echo "Product-occasion associations: {$associations}";
```

## Next Steps

1. **Admin Panel**: Add occasion management to Filament admin
2. **Product Management**: Allow admins to assign occasions to products
3. **Frontend Enhancement**: Add occasion icons and better filtering UI
4. **Analytics**: Track popular occasions and gift preferences