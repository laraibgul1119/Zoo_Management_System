# Zootopia Neobrutalism Design System

A bold, high-contrast UI component library following neobrutalism design principles.

## Design Principles

### Core Characteristics
- **Bold Borders**: 3-4px black borders on all interactive elements
- **Hard Shadows**: Offset shadows with no blur (`shadow-brutal` utilities)
- **High Contrast**: Vibrant colors against white/black backgrounds
- **Flat Design**: No gradients (except subtle background gradients)
- **Strong Typography**: Bold, uppercase text with tight tracking
- **Smooth Transitions**: 150ms ease-out transitions for interactions

### Color Palette

```css
Primary Blue: #2563EB
Secondary Green: #10B981
Accent Yellow: #FBBF24
Accent Orange: #F97316
Accent Purple: #A855F7
Accent Red: #EF4444
Neutral Gray: #171717 - #FAFAFA
```

## Components

### Button
Versatile button component with multiple variants and sizes.

**Variants**: `primary`, `secondary`, `danger`, `outline`, `ghost`
**Sizes**: `sm`, `md`, `lg`

```tsx
<Button variant="primary" size="md">Click Me</Button>
<Button variant="outline" isLoading>Loading...</Button>
```

### Card
Container component with optional title and action buttons.

**Variants**: `default`, `elevated`, `flat`
**Props**: `hover` for interactive cards

```tsx
<Card title="My Card" variant="elevated">
  Content goes here
</Card>
```

### Input
Form input with label, error states, and optional icons.

```tsx
<Input 
  label="Email" 
  type="email" 
  icon={<Mail />}
  error="Invalid email"
/>
```

### Table
Data table with striped rows and action columns.

```tsx
<Table
  data={items}
  columns={columns}
  keyField="id"
  actions={(item) => <Button size="sm">Edit</Button>}
/>
```

### Modal
Overlay dialog with customizable size.

**Sizes**: `sm`, `md`, `lg`, `xl`

```tsx
<Modal 
  isOpen={isOpen} 
  onClose={handleClose}
  title="Edit Item"
  size="lg"
>
  Modal content
</Modal>
```

### Badge
Status indicator with color variants.

**Variants**: `success`, `warning`, `danger`, `neutral`, `info`
**Sizes**: `sm`, `md`, `lg`

```tsx
<Badge variant="success" size="sm">Active</Badge>
```

### StatCard
Dashboard statistics card with icon and trend.

```tsx
<StatCard
  label="Total Users"
  value={1234}
  icon={Users}
  color="#2563EB"
  trend="+12% this month"
/>
```

### EmptyState
Placeholder for empty data states.

```tsx
<EmptyState
  icon={Inbox}
  title="No items found"
  description="Get started by creating your first item"
  action={{ label: "Create Item", onClick: handleCreate }}
/>
```

### LoadingSpinner
Loading indicator with optional text.

```tsx
<LoadingSpinner size="lg" text="Loading data..." />
```

### Toast
Notification toast with auto-dismiss.

```tsx
<Toast
  message="Successfully saved!"
  type="success"
  onClose={handleClose}
  duration={5000}
/>
```

## Utility Classes

### Shadows
- `shadow-brutal-sm`: 2px offset shadow
- `shadow-brutal`: 4px offset shadow (default)
- `shadow-brutal-lg`: 6px offset shadow
- `shadow-brutal-xl`: 8px offset shadow

### Transitions
- `transition-brutal`: 150ms ease-out transition
- `active-brutal`: Active state with translate and shadow removal

### Usage Example
```tsx
<div className="border-3 border-black shadow-brutal hover:shadow-brutal-lg transition-brutal">
  Hover me!
</div>
```

## Typography

### Font Family
Space Grotesk - A geometric sans-serif font perfect for neobrutalism

### Font Weights
- Regular (400): Body text
- Medium (500): Secondary headings
- Bold (700): Primary headings, buttons

### Text Styles
```tsx
// Page Title
<h1 className="text-4xl font-bold uppercase tracking-tight">

// Section Title
<h2 className="text-2xl font-bold uppercase tracking-tight">

// Card Title
<h3 className="text-xl font-bold uppercase tracking-tight">

// Body Text
<p className="text-base font-medium">

// Small Text
<span className="text-sm font-medium">
```

## Layout Guidelines

### Spacing Scale
- Gap between cards: `gap-6` (24px)
- Card padding: `p-6` (24px)
- Section spacing: `space-y-8` (32px)
- Page padding: `p-8` (32px)

### Grid Layouts
```tsx
// Dashboard Stats
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

// Two Column Layout
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

// Three Column Layout
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
```

## Best Practices

1. **Always use borders**: Every interactive element should have a visible border
2. **Consistent shadows**: Use brutal shadow utilities, not custom shadows
3. **Bold typography**: Prefer bold weights for important text
4. **High contrast**: Ensure text is readable against backgrounds
5. **Smooth interactions**: Use transition-brutal for hover/active states
6. **Uppercase sparingly**: Use for headings and buttons, not body text
7. **Icon consistency**: Use lucide-react icons throughout

## Accessibility

- All interactive elements have focus states
- Color is not the only indicator of state
- Sufficient color contrast ratios
- Keyboard navigation support
- Screen reader friendly labels

## Animation Guidelines

- Keep animations subtle and fast (150-300ms)
- Use ease-out timing for natural feel
- Hover effects: slight lift (-translate-y-1) + shadow increase
- Active effects: slight press (translate-x/y-[2px]) + shadow removal
- Avoid excessive motion that could cause discomfort
