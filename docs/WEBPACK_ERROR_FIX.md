# Webpack Runtime Error Fix

## Error Description
```
Unhandled Runtime Error
TypeError: Cannot read properties of undefined (reading 'call')
Call Stack
options.factory
webpack.js (715:31)
```

## Root Cause
This error typically occurs due to:
1. Hot Module Replacement (HMR) issues during development
2. Circular dependencies between modules
3. Import/export mismatches after file changes
4. Webpack module resolution conflicts

## Immediate Solutions

### 1. Restart Development Server
The quickest fix is to restart the Next.js development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
# or
yarn dev
```

### 2. Clear Next.js Cache
If restarting doesn't work, clear the cache:

```bash
# Delete .next folder and restart
rm -rf .next
npm run dev
```

### 3. Clear All Caches
For persistent issues:

```bash
# Clear all caches
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

## Recent Changes That May Have Caused This

### Token Key Updates
We recently updated multiple components to use consistent token keys:
- AdminEventManager.tsx
- AdminMarketPriceManager.tsx
- CropInterestSetup.tsx
- CropPricesByMarket.tsx
- EnhancedDashboard.tsx
- FarmSetup.tsx
- ProfileSetup.tsx

### New Component Additions
- AdminUserManager.tsx
- AdminCropManager.tsx
- ToastContext.tsx updates

## Prevention Strategies

### 1. Avoid Circular Dependencies
Ensure components don't import each other in a circular manner:

```typescript
// ❌ Avoid
// ComponentA imports ComponentB
// ComponentB imports ComponentA

// ✅ Good
// Use a shared utility or context instead
```

### 2. Consistent Import Patterns
Use consistent import patterns throughout the app:

```typescript
// ✅ Consistent
import { useToast } from "@/contexts/ToastContext"
import { getAuthToken } from "@/utils/auth"
```

### 3. Proper Export/Import Matching
Ensure exports match imports:

```typescript
// ✅ Named export/import
export const MyComponent = () => {}
import { MyComponent } from "./MyComponent"

// ✅ Default export/import
export default MyComponent
import MyComponent from "./MyComponent"
```

## Verification Steps

After restarting the server, verify:

1. ✅ Admin page loads without errors
2. ✅ Users tab displays user data
3. ✅ Crops tab displays crop data
4. ✅ Console shows proper API responses
5. ✅ Toast notifications work correctly
6. ✅ All admin functions (Events, Market Prices) still work

## If Error Persists

### Check Browser Console
Look for additional error details in the browser console:
1. Open Developer Tools (F12)
2. Check Console tab for detailed error messages
3. Look for import/export errors
4. Check Network tab for failed API requests

### Verify File Integrity
Ensure all recently modified files are syntactically correct:
- No missing imports
- No typos in component names
- Proper TypeScript types
- Correct file paths

### Check Dependencies
Verify all required dependencies are installed:

```bash
npm install
# or
yarn install
```

## Expected Behavior After Fix

Once resolved, you should be able to:
1. Navigate to `/admin` page
2. Click on Users tab and see user data in console
3. Click on Crops tab and see crop data in console
4. Use all admin functionality without errors
5. See proper toast notifications for all actions

## Contact Support

If the error persists after trying all solutions:
1. Provide the full error stack trace
2. List the exact steps that trigger the error
3. Share any additional console error messages
4. Mention which browser and version you're using