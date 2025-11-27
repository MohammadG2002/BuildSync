# Input Field Style Standards

This document defines the standardized styles for all input fields, textareas, and select elements across the BuildSync application.

## Standard Specifications

All form input elements (input, textarea, select) should follow these consistent styles:

### Core Styles

```css
 {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
  transition: all 0.2s ease-in-out;
  background-color: white;
  color: #111827;
}
```

### Focus State

```css
:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

### Dark Mode

```css
:global(.dark) {
  border-color: #4b5563;
  background-color: #374151;
  color: #f9fafb;
}

:global(.dark):focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}
```

### Disabled State (for inputs)

```css
:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.6;
}

:global(.dark):disabled {
  background-color: #374151;
}
```

## Specific Field Types

### Textarea

- **Resize**: `resize: none` (prevent manual resizing for consistency)
- All other properties follow the standard specifications above

### Select Dropdown

- All properties follow the standard specifications above
- Custom chevron icons can be added via background-image if needed

### Text Input

- All properties follow the standard specifications above
- Icon support via padding-left adjustment when icon is present

## Reference Implementation

See `frontend/src/components/common/input/Input.module.css` for the canonical implementation of these standards.

## Standardized Files

The following files have been updated to match these standards:

### Forms

- ✅ `components/settings/Settings.module.css` - descriptionTextarea
- ✅ `components/profile/Profile.module.css` - bioTextarea
- ✅ `components/project/projectFormModule/ProjectForm.module.css` - textarea, select
- ✅ `components/task/taskFormModule/TaskForm.module.css` - descriptionTextarea, select
- ✅ `components/workspace/workspaceFormModule/WorkspaceForm.module.css` - textarea

### Pages

- ✅ `pages/members/Members.module.css` - roleSelect
- ✅ `pages/notifications/Notifications.module.css` - select
- ✅ `pages/chat/Chat.module.css` - input (textarea)

### Modals & Details

- ✅ `components/task/taskDetailsModalModule/TaskDetailsModal.module.css` - headerTitleInput, descriptionTextarea, commentInput, subtaskInput
- ✅ `components/projectDetails/ProjectDetails.module.css` - memberSearchInput, groupBySelect

### AI Components

- ✅ `components/ai/PopupChatPanel.module.css` - textArea
- ✅ `components/ai/ChatPanel.module.css` - input

### Utilities

- ✅ `components/common/tag/tagManagerOverlay.module.css` - nameInput

## Key Measurements

- **Padding**: `0.5rem 1rem` (consistent vertical and horizontal spacing)
- **Border**: `1px solid #d1d5db` (light mode), `1px solid #4b5563` (dark mode)
- **Border Radius**: `0.5rem` (8px, consistent rounded corners)
- **Focus Ring**: `3px` shadow with 10% opacity (light), 20% opacity (dark)
- **Transition**: `all 0.2s ease-in-out` (smooth state changes)

## Colors

### Light Mode

- **Background**: `white` (#ffffff)
- **Text**: `#111827`
- **Border**: `#d1d5db`
- **Border (focus)**: `#3b82f6`
- **Shadow (focus)**: `rgba(59, 130, 246, 0.1)`
- **Disabled Background**: `#f3f4f6`

### Dark Mode

- **Background**: `#374151`
- **Text**: `#f9fafb`
- **Border**: `#4b5563`
- **Border (focus)**: `#3b82f6`
- **Shadow (focus)**: `rgba(59, 130, 246, 0.2)`
- **Disabled Background**: `#374151`

## Best Practices

1. **Always use the common Input component** when possible rather than creating custom input styles
2. **Maintain consistent padding** (0.5rem 1rem) across all input fields
3. **Use standard border-radius** (0.5rem) for visual consistency
4. **Include proper dark mode styles** for all input fields
5. **Add appropriate focus states** with the standard blue border and shadow
6. **Use transition** for smooth hover and focus state changes
7. **Provide disabled states** for inputs that can be disabled
8. **Test in both light and dark modes** to ensure consistency

## Exceptions

The following components intentionally use different styles for specific UX reasons:

- **GlobalSearch input**: Transparent background, no border (integrated search bar design)
- **Calendar timeInput**: Specialized compact design for time selection
- **PasswordInput toggle button**: Positioned absolutely, separate from input styles

---

**Last Updated**: November 26, 2025
**Maintained By**: BuildSync Development Team
