# Platform Design System

## Colors
- **Primary**: Indigo (Tailwind `indigo-600`)
- **Secondary**: Slate (Tailwind `slate-500`)
- **Background**: White & Slate-50
- **Success**: Green-600
- **Danger**: Red-500

## Typography
- **Sans**: Inter (Default browser sans)
- **Mono**: JetBrains Mono / Fira Code (for API identifiers)

## Spacing
- **Container**: `max-w-7xl` or `max-w-4xl` for builders.
- **Padding**: `p-6` or `p-8` for main cards.
- **Gap**: `gap-4` or `gap-6` standard.

## Components
- **Buttons**: Rounded, solid color for primary, outline for secondary.
- **Cards**: `bg-white border rounded-xl shadow-sm`.
- **Inputs**: Rounded-md, border border-input, ring-focus.
- **Tables**: `bg-white border rounded-xl shadow-sm overflow-hidden`, `divide-y`.

## Rationale
The design needs to be highly functional, clean, and dense enough for Enterprise CRM administration. We avoid playful colors and stick to professional slate/indigo. Forms use clear borders and labels for max readability.
