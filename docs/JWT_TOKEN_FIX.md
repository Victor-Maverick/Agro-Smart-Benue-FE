# JWT Token Issue Fix

## Problem Identified

The JWT verification error you encountered:
```
JWT verification failed: The Claim 'iss' value doesn't match the required issuer.
```

Was caused by **inconsistent token storage keys** in the frontend, not an actual issuer mismatch.

## Root Cause

### Token Storage Inconsistency
- **AuthContext stores token as**: `localStorage.setItem("bfpc_token", userData.token)`
- **Some components used**: `localStorage.getItem("token")` ❌
- **Other components used**: `localStorage.getItem("bfpc_token")` ✅

### What Was Happening
1. User logs in successfully
2. Token gets stored as `"bfpc_token"` in localStorage
3. Some components try to retrieve token using `"token"` key
4. These components get `null` instead of the actual token
5. API requests are sent with `Authorization: Bearer null`
6. Backend receives invalid/missing token
7. JWT verification fails

## Files Fixed

### ✅ Updated Token Retrieval Key
Changed from `localStorage.getItem("token")` to `localStorage.getItem("bfpc_token")` in:

1. **AdminEventManager.tsx**
   - `fetchEvents()` function
   - `handleSubmit()` function  
   - `handleDelete()` function

2. **AdminMarketPriceManager.tsx**
   - `fetchData()` function
   - `handleSubmit()` function

3. **CropInterestSetup.tsx**
   - Token retrieval for API calls

4. **CropPricesByMarket.tsx**
   - Token retrieval for API calls

5. **EnhancedDashboard.tsx**
   - `checkSetupStatus()` function

6. **FarmSetup.tsx**
   - Token retrieval for API calls

7. **ProfileSetup.tsx**
   - Token retrieval for API calls

### ✅ Already Correct
These components were already using the correct token key:
- **AdminUserManager.tsx**
- **AdminCropManager.tsx**
- **AuthContext.tsx** (token storage)

## Backend JWT Configuration

Your backend JWT configuration is correct:

### Token Generation (AuthController.java)
```java
return JWT.create()
    .withIssuer("BFPCAuthToken")  // ✅ Correct
    .withIssuedAt(now)
    .withExpiresAt(now.plus(24, HOURS))
    .withSubject(principal.getUsername())
    .withClaim("principal", principal.getUsername())
    .withClaim("credentials", authentication.getCredentials().toString())
    .withArrayClaim("roles", extractAuthorities(authentication.getAuthorities()))
    .sign(algorithm);
```

### Token Verification (CustomAuthorizationFilter.java)
```java
JWTVerifier jwtVerifier = JWT.require(algorithm)
    .withIssuer("BFPCAuthToken")  // ✅ Matches generation
    .withClaimPresence("roles")
    .withClaimPresence("principal")
    .withClaimPresence("credentials")
    .build();
```

## Testing the Fix

After this fix:

1. **Login Process**: Should work normally
2. **Token Storage**: Token stored as `"bfpc_token"`
3. **API Calls**: All components now use consistent token key
4. **JWT Verification**: Should pass successfully
5. **Admin Functions**: Users, Crops, Events, Market Prices should all work

## Prevention

To prevent this issue in the future:

### 1. Create a Token Utility
```typescript
// utils/auth.ts
export const getAuthToken = () => localStorage.getItem("bfpc_token")
export const setAuthToken = (token: string) => localStorage.setItem("bfpc_token", token)
export const removeAuthToken = () => localStorage.removeItem("bfpc_token")
```

### 2. Use Consistent Import
```typescript
import { getAuthToken } from "@/utils/auth"

// Instead of:
const token = localStorage.getItem("token") // ❌

// Use:
const token = getAuthToken() // ✅
```

## Summary

The JWT issuer configuration was correct all along. The error was misleading because:
1. Frontend sent `null` token due to wrong localStorage key
2. Backend couldn't verify `null` token
3. Error message mentioned issuer mismatch (generic JWT error)

The fix ensures all components use the same token storage key (`"bfpc_token"`), resolving the authentication issues.