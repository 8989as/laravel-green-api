# CSS Organization Guide

## CSS Loading Order (Fixed)

The styles are now loaded in the correct order to prevent conflicts:

1. **Bootstrap CSS** (from CDN or node_modules)
2. **Bootstrap JS** (for interactive components)
3. **Custom CSS Variables** (`index.css`)
4. **Component-specific styles**

## File Structure

```
resources/js/
├── index.css              # Global styles, CSS variables, resets
├── App.css               # App component specific styles
├── components/
│   ├── Breadcrumb/
│   │   └── Breadcrumb.css    # Component styles using CSS variables
│   ├── About/
│   │   └── About.module.css  # CSS modules for scoped styles
│   └── ...
└── pages/
    └── ...
```

## CSS Variables System

All colors, spacing, and typography are now centralized in `index.css`:

```css
:root {
  /* Colors */
  --color-primary: #28a745;
  --color-primary-dark: #1e7e34;
  --text-primary: #212529;
  --bg-primary: #ffffff;
  
  /* Typography */
  --font-family-primary: 'El Messiri', sans-serif;
  
  /* Spacing */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
}
```

## Usage Guidelines

### ✅ DO:
- Use CSS variables for consistent theming
- Import Bootstrap before custom styles
- Use semantic class names
- Follow BEM methodology for complex components
- Use CSS modules for component-specific styles

### ❌ DON'T:
- Import the same font multiple times
- Override Bootstrap with !important unless necessary
- Use inline styles for complex styling
- Import CSS in random order

## RTL Support

RTL support is handled through:
- CSS logical properties where possible
- Direction-specific overrides in `index.css`
- Bootstrap's built-in RTL utilities

## Responsive Design

- Mobile-first approach using Bootstrap's breakpoints
- Custom responsive utilities in `index.css`
- Consistent spacing using CSS variables

## Performance Optimizations

- Single font import in `index.css`
- CSS variables reduce bundle size
- Proper loading order prevents FOUC (Flash of Unstyled Content)
- Minimal CSS overrides

## Accessibility

- High contrast mode support
- Reduced motion support
- Focus styles for keyboard navigation
- Semantic HTML with proper ARIA attributes