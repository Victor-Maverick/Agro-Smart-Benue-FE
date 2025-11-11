# API Base URL Fix

## Issue
All API endpoints were calling relative URLs (e.g., `/api/events`) which were trying to reach `http://localhost:3000` (Next.js dev server) instead of the backend API at `http://localhost:8080`.

## Solution
Updated all fetch calls to use `${process.env.NEXT_PUBLIC_API_BASE_URL}` environment variable.

## Environment Variable
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Files Updated

### 1. AdminEventManager.tsx
- ✅ `fetchEvents()` - GET /api/events
- ✅ `handleSubmit()` - POST/PUT /api/events
- ✅ `handleDelete()` - DELETE /api/events/{id}

### 2. AdminMarketPriceManager.tsx
- ✅ `fetchData()` - GET /api/crops
- ✅ `fetchData()` - GET /api/market-prices/recent
- ✅ `handleSubmit()` - POST /api/market-prices/update-or-create

### 3. ProfileSetup.tsx
- ✅ `handleSubmit()` - POST /api/users/profile

### 4. FarmSetup.tsx
- ✅ `handleSubmit()` - POST /api/farms

### 5. EnhancedDashboard.tsx
- ✅ `checkSetupStatus()` - GET /api/users/profile/status
- ✅ `checkSetupStatus()` - GET /api/farms
- ✅ `checkSetupStatus()` - GET /api/user-crop-interests

### 6. CropPricesByMarket.tsx
- ✅ `fetchPrices()` - GET /api/market-prices/crop/{cropId}/by-market

### 7. CropInterestSetup.tsx
- ✅ `handleSubmit()` - POST /api/user-crop-interests

## Already Correct
These components were already using the proper base URL:
- ✅ AdminUserManager.tsx
- ✅ AdminCropManager.tsx
- ✅ AuthContext.tsx

## Before vs After

### Before (Incorrect)
```typescript
const response = await fetch("/api/events")
// Calls: http://localhost:3000/api/events ❌
```

### After (Correct)
```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events`)
// Calls: http://localhost:8080/api/events ✅
```

## Testing
After this fix, all API calls should now properly reach the backend server at `http://localhost:8080`.

To verify:
1. Check browser console - no more 404 errors
2. Check Network tab - all API calls go to localhost:8080
3. Test each admin function (Events, Market Prices, Users, Crops)
4. Test user dashboard features (Profile, Farm, Crop Interests)

## Production Configuration
For production, update `.env.production`:
```
NEXT_PUBLIC_API_BASE_URL=https://your-production-api.com
```

The `NEXT_PUBLIC_` prefix ensures the variable is available in the browser.