# SideBar Component

The SideBar component provides filtering functionality for both regular products and gift products with occasion-based filtering.

## Features

- **Dual Mode**: Supports both regular product filtering and gift-specific filtering
- **Occasion Filtering**: When `isGift={true}`, shows occasions instead of categories/colors/sizes
- **Price Range**: Always available for both modes
- **Multilingual**: Supports Arabic and English with RTL/LTR layouts
- **Icon Support**: Displays icons for occasions

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `categories` | Array | `[]` | List of product categories |
| `colors` | Array | `[]` | List of available colors |
| `sizes` | Array | `[]` | List of available sizes |
| `occasions` | Array | `[]` | List of gift occasions |
| `priceRange` | Object | `{min: 0, max: 1000}` | Price range limits |
| `isGift` | Boolean | `false` | Whether to show gift-specific filters |
| `onFilterChange` | Function | `() => {}` | Callback when filters change |
| `onApplyFilters` | Function | `() => {}` | Callback when apply button is clicked |
| `initialFilters` | Object | `{}` | Initial filter values |

## Usage

### Regular Products
```jsx
<SideBar
  categories={categories}
  colors={colors}
  sizes={sizes}
  priceRange={{ min: 0, max: 1000 }}
  isGift={false}
  onFilterChange={handleFilterChange}
  onApplyFilters={handleApplyFilters}
  initialFilters={{
    categories: [],
    colors: [],
    sizes: [],
    priceRange: [0, 1000]
  }}
/>
```

### Gift Products
```jsx
<SideBar
  occasions={occasions}
  priceRange={{ min: 0, max: 1000 }}
  isGift={true}
  onFilterChange={handleFilterChange}
  onApplyFilters={handleApplyFilters}
  initialFilters={{
    occasions: [],
    priceRange: [0, 1000]
  }}
/>
```

## Data Structure

### Occasions
```javascript
const occasions = [
  {
    id: 1,
    name_ar: 'عيد ميلاد',
    name_en: 'Birthday',
    slug: 'birthday',
    icon: '🎂',
    is_active: true
  },
  // ... more occasions
];
```

### Categories
```javascript
const categories = [
  {
    id: 1,
    category_ar: 'نباتات داخلية',
    category_en: 'Indoor Plants',
    slug: 'indoor-plants'
  },
  // ... more categories
];
```

### Colors
```javascript
const colors = [
  {
    id: 1,
    color_ar: 'أخضر',
    color_en: 'Green',
    hex_code: '#22C55E',
    icon: '/icons/green.svg' // optional
  },
  // ... more colors
];
```

### Sizes
```javascript
const sizes = [
  {
    id: 1,
    size_ar: 'صغير',
    size_en: 'Small'
  },
  // ... more sizes
];
```

## Filter Object Structure

The component returns filter objects in this format:

```javascript
{
  categories: [1, 2, 3], // Array of category IDs
  colors: [1, 2],        // Array of color IDs
  sizes: [1],            // Array of size IDs
  occasions: [1, 2],     // Array of occasion IDs (for gifts)
  priceRange: [100, 500] // [min, max] price range
}
```

## API Integration

When using with the Laravel backend, the filter parameters should be sent as:

### Regular Products
```javascript
const queryParams = new URLSearchParams();
if (filters.categories.length > 0) {
  queryParams.append('category', filters.categories.join(','));
}
if (filters.colors.length > 0) {
  queryParams.append('color', filters.colors.join(','));
}
if (filters.sizes.length > 0) {
  queryParams.append('size', filters.sizes.join(','));
}
queryParams.append('min_price', filters.priceRange[0]);
queryParams.append('max_price', filters.priceRange[1]);
```

### Gift Products
```javascript
const queryParams = new URLSearchParams();
if (filters.occasions.length > 0) {
  queryParams.append('occasion', filters.occasions[0]); // API expects single occasion
}
queryParams.append('min_price', filters.priceRange[0]);
queryParams.append('max_price', filters.priceRange[1]);
```

## Styling

The component uses CSS custom properties for theming:

```css
:root {
  --primary-color: #224921;
  --secondary-color: #6F816E;
  --border-color: #C3D9C3;
  --background-color: #fff;
}
```

## RTL Support

The component automatically adjusts layout based on the current language:
- Arabic: RTL layout with right-aligned text
- English: LTR layout with left-aligned text