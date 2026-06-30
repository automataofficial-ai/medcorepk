# Professional Toast Notification System

The app now uses a professional, modern toast notification system instead of browser alerts. This system displays beautiful, animated notifications in the top-right corner of the screen.

## Overview

The toast system is built with:
- **Toast.tsx** - Individual toast component with styling
- **ToastContext.tsx** - Context and hooks for managing toasts
- **ToastContainer.tsx** - Container that displays all active toasts
- Integrated in **app/layout.tsx** - Available throughout the entire app

## Usage

### Basic Setup (Already Done)
The entire app is wrapped with the `ToastProvider` in the root layout, so you can use toasts anywhere:

```tsx
// In any component
'use client';
import { useToast } from '@/context/ToastContext';

export default function MyComponent() {
  const { success, error, warning, info } = useToast();
  // ...
}
```

### Toast Types

#### 1. **Success** - Green notification
```tsx
toast.success('Success!', 'Operation completed successfully');
toast.success('Block Completed', 'Great job! You completed this block', 5000);
```
- **Icon**: ✓ CheckCircle (green)
- **Default Duration**: 5 seconds
- **Use for**: Completed actions, saved data, successful operations

#### 2. **Error** - Red notification
```tsx
toast.error('Login Failed', 'Invalid email or password');
toast.error('Error', 'Something went wrong. Please try again', 6000);
```
- **Icon**: ⚠ AlertCircle (red)
- **Default Duration**: 6 seconds (longer to give time to read)
- **Use for**: Failed operations, validation errors, exceptions

#### 3. **Warning** - Yellow notification
```tsx
toast.warning('Unsaved Changes', 'You have unsaved progress');
toast.warning('Check Answers', 'You skipped some questions');
```
- **Icon**: ⚠ AlertTriangle (amber)
- **Default Duration**: 5 seconds
- **Use for**: Cautions, important notices, warnings

#### 4. **Info** - Blue notification
```tsx
toast.info('Loading', 'Fetching your blocks...');
toast.info('Tip', 'Double-click to select all text', 4000);
```
- **Icon**: ℹ Info (blue)
- **Default Duration**: 4 seconds
- **Use for**: Informational messages, tips, status updates

## Examples in Different Scenarios

### After Completing a Quiz
```tsx
// In quiz page after finishing
success('Quiz Complete! 🎉', `Score: ${score}%`);
```

### Form Validation Error
```tsx
if (!email) {
  error('Validation Failed', 'Please enter your email address');
  return;
}
```

### API Call Success
```tsx
try {
  const res = await fetch('/api/blocks');
  success('Blocks Loaded', `${blocks.length} blocks available`);
} catch (err) {
  error('Failed to Load', 'Could not fetch blocks. Please try again');
}
```

### Unsaved Data Warning
```tsx
if (hasChanges && isLeavingPage) {
  warning('Unsaved Changes', 'Your progress has been saved automatically');
}
```

### Login Experience
```tsx
// Login successful
success('Welcome!', `Signed in as ${email}`);

// Login failed
error('Login Failed', 'Invalid credentials. Please try again');

// Loading state
info('Signing in...', 'Please wait while we verify your credentials', 0); // 0 = no auto-close
```

## Customization Options

### Duration Control
```tsx
// 3 seconds
success('Quick', 'This disappears in 3 seconds', 3000);

// No auto-close (persist until user clicks X)
error('Critical', 'This stays until dismissed', 0);
```

### With Action Button
```tsx
const { addToast } = useToast();

addToast({
  type: 'info',
  title: 'Update Available',
  message: 'A new version is ready',
  duration: 0, // Persist until dismissed
  action: {
    label: 'Reload',
    onClick: () => window.location.reload(),
  },
});
```

## Styling Features

Each toast type has its own color scheme:

| Type | Icon | Color | Background |
|------|------|-------|------------|
| Success | ✓ | Green (#10B981) | Light Green |
| Error | ⚠ | Red (#EF4444) | Light Red |
| Warning | ⚠ | Amber (#F59E0B) | Light Amber |
| Info | ℹ | Blue (#3B82F6) | Light Blue |

All toasts feature:
- ✓ Smooth slide-in animation from right
- ✓ Close button (X)
- ✓ Semi-transparent glass morphism background
- ✓ Icon with relevant color
- ✓ Optional message body
- ✓ Optional action button
- ✓ Auto-dismiss (configurable)

## Best Practices

### ✅ DO
- Use descriptive titles: "Login Failed" vs just "Error"
- Provide helpful messages: "Enter a valid email address" vs "Invalid"
- Use appropriate types: error for failures, success for completions
- Keep messages concise: Under 100 characters for the message
- Use warnings for important notices users might miss

### ❌ DON'T
- Don't use toasts for every minor action
- Don't use HTML in messages (stick to plain text)
- Don't show too many toasts at once (stack is vertical)
- Don't use for forms - use inline validation instead
- Don't replace critical errors with just a toast - also log to console

## Already Updated Pages

The following pages have been updated to use professional toasts:
- ✅ Login page (`/app/login/page.tsx`)

## Future Integrations

To use toasts in other pages, add this import and use it:

```tsx
import { useToast } from '@/context/ToastContext';

const { success, error, warning, info } = useToast();
```

Common pages to update:
- Signup page
- Dashboard (data fetch errors)
- Quiz page (validation, completion)
- Review page (errors)
- API error handling (everywhere)

## Technical Details

- **Location**: `/components/Toast.tsx`, `/context/ToastContext.tsx`, `/components/ToastContainer.tsx`
- **Dependencies**: lucide-react (for icons), React Context API
- **Performance**: Efficient rendering with key-based toast management
- **Accessibility**: Proper semantic HTML, keyboard dismissible
