# Pages Directory - Clean Architecture

## Core Principle

**Pages are composition layers only** - they assemble components, call hooks/services, and handle routing/layout. All reusable logic lives outside `pages/`.

---

## Structure Guidelines

### ✅ What belongs in `pages/`

- **Page components only** (`PageName.jsx`)
- **Page-specific styles** (`PageName.module.css`)
- **Route-level composition** (assembling components, calling hooks)

### ❌ What does NOT belong in `pages/`

- ❌ Reusable UI components → `src/components/`
- ❌ Custom hooks → `src/hooks/`
- ❌ Utilities/helpers → `src/utils/` or `src/helpers/`
- ❌ Business logic → `src/services/` or `src/features/`
- ❌ Barrel export files (removed for clarity)

---

## Current Structure

```
pages/
├─ archived/
│  ├─ Archived.jsx
│  └─ Archived.module.css
├─ auth/
│  ├─ Login.jsx
│  ├─ Register.jsx
│  ├─ ForgotPassword.jsx
│  └─ Auth.module.css
├─ chat/
│  ├─ Chat.jsx
│  ├─ AIChat.jsx
│  └─ Chat.module.css
├─ dashboard/
│  ├─ Dashboard.jsx
│  └─ Dashboard.module.css
├─ landing/
│  ├─ LandingPage.jsx
│  └─ LandingPage.module.css
├─ members/
│  ├─ Members.jsx
│  └─ Members.module.css
├─ not-found/
│  ├─ index.jsx
│  └─ NotFound.module.css
├─ notifications/
│  ├─ Notifications.jsx
│  └─ Notifications.module.css
├─ profile/
│  ├─ Profile.jsx
│  └─ Profile.module.css
├─ projects/
│  ├─ ProjectDetails/
│  │  ├─ index.jsx
│  │  └─ ProjectDetails.module.css
│  ├─ ProjectGantt/
│  │  └─ index.jsx
│  └─ ProjectNetwork/
│     └─ index.jsx
├─ settings/
│  ├─ Settings.jsx
│  └─ Settings.module.css
└─ workspaces/
   ├─ Workspaces.jsx
   ├─ WorkspaceDetails.jsx
   ├─ Workspaces.module.css
   └─ WorkspaceDetails.module.css
```

---

## Migration Notes

### Recently Cleaned Up ✨

- ✅ Removed 4 hook re-exports from `chat/` (hooks moved to `src/hooks/chat/`)
- ✅ Removed 3 barrel export files from `projects/`
- ✅ Removed empty folders (`chat/AIChat/`, `workspaces/WorkspaceDetails/`)
- ✅ Removed duplicate CSS files
- ✅ All utilities moved to `src/utils/helpers/`

### Import Patterns

Pages should import from:

```javascript
// Hooks from hooks/
import { useAuth } from "../../hooks/useAuth";
import { useMessages } from "../../hooks/chat/useMessages";

// Components from components/
import Card from "../../components/common/card/Card/Card";
import ChatArea from "../../components/chatPage/ChatArea/ChatArea";

// Utils from utils/
import { handleSendMessage } from "../../utils/chat/handleSendMessage";
import { formatDate } from "../../utils/helpers";

// Services from services/
import { getWorkspaces } from "../../services/workspaceService";
```

---

## How to Add a New Page

1. **Create page component:**

   ```
   src/pages/<page-name>/
   ├─ PageName.jsx
   └─ PageName.module.css
   ```

2. **Page structure:**

   ```javascript
   import { useState } from "react";
   import { useCustomHook } from "../../hooks/useCustomHook";
   import PageComponent from "../../components/page/PageComponent/PageComponent";
   import styles from "./PageName.module.css";

   const PageName = () => {
     const { data, loading } = useCustomHook();

     return (
       <div className={styles.container}>
         <PageComponent data={data} loading={loading} />
       </div>
     );
   };

   export default PageName;
   ```

3. **Add route in `src/routes/AppRoutes.jsx`:**

   ```javascript
   const PageName = lazy(() => import("../pages/page-name/PageName"));
   ```

4. **If you need custom logic:**
   - Extract to custom hook → `src/hooks/usePageName.js`
   - Extract utilities → `src/utils/page-name/`
   - Extract components → `src/components/page-name/`

---

## Best Practices

### Page Component Responsibilities

✅ Compose UI from components  
✅ Call hooks for state/effects  
✅ Handle route params  
✅ Pass data to child components

❌ Don't implement complex logic  
❌ Don't create reusable components inline  
❌ Don't duplicate utilities

### CSS Module Naming

- Use `ComponentName.module.css` for scoped styles
- Keep global utilities in `src/styles/`
- Avoid sharing page-specific styles

### File Organization

- One page per file (no multi-page files)
- Co-locate styles with components
- Group related pages in subdirectories (e.g., `auth/`, `projects/`)

---

## Related Documentation

- Component structure: `src/components/README.md`
- Hook conventions: `src/hooks/README.md`
- Utility organization: `src/utils/README.md`
- Routing setup: `src/routes/README.md`
