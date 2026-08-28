# SIH2026 CropGuard - Complete Showcase Master Prompt for Antigravity AI

## 🎯 PROJECT OVERVIEW
**Project Name**: Satellite-Based Crop Health Monitoring and Early Warning System for Farmers
**Goal**: Smart India Hackathon 2026 Top-Tier Showcase
**Current Status**: Functional at 65% - Critical security and completeness issues identified
**Analysis Date**: Generated after comprehensive codebase audit
**Repository**: https://github.com/Gyanankur23/SIH2026.git
**Demo URL**: https://sih2026.vercel.app (once deployed)

---

## 🚨 CRITICAL SECURITY ISSUES (MUST FIX BEFORE SHOWCASE - DISQUALIFICATION RISKS)

### 1. REMOVE HARDCODED CREDENTIALS
**File**: `backend/src/routes/authRoutes.ts`
**Lines**: 10-35 (officer accounts), Line 87 (farmer password)
**Status**: DEMO CREDENTIALS HARDCODED IN CODE WITH PLAINTEXT PASSWORDS
**Issue**: Lines 14, 22, 30 all have `password: '12345'`
**Risk**: CRITICAL SECURITY VULNERABILITY - shows poor security practices
**Fix Required**:
```typescript
// DELETE these lines from authRoutes.ts:
const OFFICER_ACCOUNTS = [
  {
    id: 'officer-user-123',
    email: 'officer@gmail.com',
    password: '12345',  // ❌ REMOVE THIS
    ...
  },
  ...
];

// REPLACE with database query for Officer model
```

### 2. IMPLEMENT PASSWORD HASHING
**File**: `backend/src/routes/authRoutes.ts`
**Line**: 86 (comment says "use bcrypt.compare" but NOT implemented)
**Line**: 144 (registration stores password in plain text)
**Status**: PASSWORDS STORED IN PLAIN TEXT
**Risk**: CRITICAL SECURITY VULNERABILITY
**Fix Required**:
```typescript
// Add password field to Farmer model in schema.prisma
model Farmer {
  ...
  password String  // ADD THIS
  ...
}

// Add bcrypt.hash on registration (line ~144)
const hashedPassword = await bcrypt.hash(password, 10);

// Add bcrypt.compare on login (line ~87)
const validPassword = await bcrypt.compare(password, farmer.password);
```

### 3. ADD AUTHENTICATION MIDDLEWARE
**File**: `backend/src/index.ts`
**Status**: NO ROUTE PROTECTION EXCEPT /auth
**Issue**: All API routes are unprotected
**Risk**: Any authenticated user can access any data
**Fix Required**:
```typescript
// Create backend/src/middleware/auth.ts
export const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Apply to all routes
app.use('/api/plots', authenticateToken, plotRoutes);
app.use('/api/alerts', authenticateToken, alertRoutes);
// etc.
```

### 4. ADD AUTHORIZATION CHECKS
**Status**: NO ROLE-BASED ACCESS CONTROL
**Issue**: Farmers can access officer endpoints, cross-user data access possible
**Fix Required**: Add middleware to check user role and data ownership

### 5. FARMER MODEL MISSING PASSWORD FIELD
**File**: `backend/prisma/schema.prisma`
**Lines**: 14-24 (Farmer model)
**Issue**: No password field in schema, cannot store passwords securely
**Fix Required**: Add `password String` field to Farmer model

---

## 📋 CRITICAL FUNCTIONALITY ISSUES (PROFESSIONALISM RISKS)

### 6. REMOVE EMOJIS FROM PRODUCTION CODE
**File**: `frontend/src/pages/FarmerDashboard.tsx`
**Line**: 544
**Status**: 🛰️ emoji visible in satellite imagery section
**Risk**: Looks unprofessional for showcase
**Fix Required**: Replace with professional text "Satellite Imagery"

### 7. FIX NON-FUNCTIONAL BUTTONS
**Files**: 
- `frontend/src/pages/OfficerDashboard.tsx` (lines 199, 378, 382)
- `frontend/src/pages/AlertsPage.tsx` (line 291)
**Status**: Buttons have no click handlers
**Issue**: "Export Report", "View Details", "Contact Farmer", "View Details" buttons do nothing
**Risk**: Judges will click and see nothing happens
**Fix Required**: Either implement handlers or remove buttons

### 8. FIX MOBILE MENU
**File**: `frontend/src/components/Navigation.tsx`
**Lines**: 65-78
**Status**: Mobile menu button exists but is always hidden (`md:hidden hidden`)
**Issue**: Mobile menu toggle functionality not implemented
**Risk**: Poor UX on mobile devices
**Fix Required**: Implement mobile menu state and toggle handler

### 9. FIX TIME RANGE FILTER
**File**: `frontend/src/pages/AlertsPage.tsx`
**Lines**: 172-183
**Status**: Filter UI exists (7d/30d/90d) but filtering logic not implemented
**Issue**: Filter dropdown changes value but doesn't filter alerts
**Risk**: Non-functional feature visible to judges
**Fix Required**: Implement timestamp-based filtering logic

### 10. REMOVE NOTIFICATION SETTINGS COSMETIC UI
**File**: `frontend/src/pages/AlertsPage.tsx`
**Lines**: 309-332
**Status**: Checkboxes have no backend integration
**Issue**: "Email Alerts", "SMS Alerts", "WhatsApp Alerts" checkboxes do nothing
**Risk**: Shows incomplete implementation
**Fix Required**: Either implement backend integration or remove section

---

## 🔧 HIGH PRIORITY FIXES (IMPORTANT FOR PROFESSIONALISM)

### 11. ADD DATABASE CONNECTION & ENVIRONMENT
**Status**: Connected to Supabase but credentials in local .env
**Action Required**:
- Add database URL to Vercel environment variables (do NOT commit .env)
- Add NASA API key to Vercel environment variables
- Add OpenWeather API key to Vercel environment variables
- Verify Supabase connection is stable in production

**Files**: 
- `backend/.env` (contains sensitive credentials - NEVER commit)
- `backend/.env.example` (has placeholder credentials)
- Vercel Dashboard → Settings → Environment Variables

**Required Vercel Environment Variables**:
```
DATABASE_URL=postgresql://postgres:your_password@your_supabase_host:5432/postgres
NASA_API_KEY=your_nasa_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
JWT_SECRET=change-this-to-a-secure-random-string-in-production
```

### 12. VERIFY VERCEL DEPLOYMENT CONFIGURATION
**Status**: Root vercel.json exists, check for nested configs
**Action Required**:
- Keep ONLY root `vercel.json` for monorepo deployment
- Remove `frontend/vercel.json` if it exists
- Remove `backend/vercel.json` if it exists
- Set Vercel project Root Directory to `/` (repository root)
- Ensure Framework Preset is set to "Other" or Vercel auto-detects

**Files**:
- `vercel.json` (root - KEEP THIS)
- Check for any nested vercel.json files (DELETE if found)

### 13. IMPLEMENT REAL API INTEGRATIONS
**Files**: 
- `backend/src/services/satelliteService.ts` (NASA API)
- `backend/src/services/weatherService.ts` (OpenWeather API)
**Status**: Both fall back to mock data due to missing keys in production
**Action Required**:
- Add NASA_API_KEY to environment
- Add OPENWEATHER_API_KEY to environment
- Test real API integrations work
- Ensure graceful fallback if APIs fail

### 14. ADD PASSWORD FIELD TO DATABASE SCHEMA
**File**: `backend/prisma/schema.prisma`
**Line**: 14-24 (Farmer model)
**Action Required**:
```prisma
model Farmer {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  phone     String?
  location  String
  password  String   // ADD THIS
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  plots     Plot[]
}
```
Then run: `npx prisma db push`

### 15. MOVE OFFICER ACCOUNTS TO DATABASE
**Status**: Officers hardcoded in code
**Action Required**:
- Create Officer model in schema.prisma
- Move officer accounts to seed.ts
- Update authRoutes.ts to query database instead of hardcoded array

### 16. ADD DATABASE INDEXES
**File**: `backend/prisma/schema.prisma`
**Action Required**: Add indexes for performance
```prisma
@@index([farmerId])
@@index([plotId])
@@index([timestamp])
@@index([severity])
```

---

## ✨ ENHANCEMENT FEATURES TO ADD (TIME PERMITTING)

### Priority 1 (Showcase Impact)
1. **Export Report Functionality**: Complete PDF generation with pdfkit or puppeteer
2. **Map Boundary Drawing**: Integrate Leaflet Draw for plot registration
3. **Loading Skeletons**: Replace spinners with skeleton loaders for better UX
4. **Error Boundaries**: Add React error boundaries to prevent app crashes
5. **Toast Notifications**: Add success/error notifications for user actions

### Priority 2 (Professional Polish)
1. **Rate Limiting**: Add express-rate-limit middleware
2. **Input Validation**: Add Zod or Joi for request validation
3. **Security Headers**: Add helmet middleware
4. **CORS Configuration**: Restrict to production domain
5. **API Retry Logic**: Add exponential backoff for failed requests

### Priority 3 (Feature Completeness)
1. **PDF Report Generation**: Complete implementation
2. **CSV Export**: Complete functionality
3. **Email Verification**: Send verification email on signup
4. **Password Reset**: Implement forgot password flow
5. **Token Refresh**: Implement refresh token mechanism

---

## 🧪 TESTING CHECKLIST

### Authentication Testing
- [ ] Test all 6 demo accounts login successfully
- [ ] Test signup creates new farmer in database
- [ ] Test logout clears session and redirects to login
- [ ] Test expired tokens redirect to login
- [ ] Test protected routes without authentication

### Farmer Dashboard Testing
- [ ] Login as farmer, verify only their plots appear
- [ ] Click on plot, verify analysis loads immediately
- [ ] Verify NDVI chart displays with 30-day data
- [ ] Verify weather cards show all 4 metrics
- [ ] Test plot registration with valid data
- [ ] Test plot registration with invalid data (error handling)
- [ ] Verify alerts show only farmer's own alerts
- [ ] Test resolving an alert updates the list

### Officer Dashboard Testing
- [ ] Login as officer (Nashik), verify only Nashik data appears
- [ ] Login as officer (Pune), verify only Pune data appears
- [ ] Login as officer (All Maharashtra), verify all data appears
- [ ] Test risk filter (select "high", verify only high alerts)
- [ ] Test map displays plot locations correctly
- [ ] Verify officer sees farmer names with their plots

### Alerts Page Testing
- [ ] Login as farmer, verify only their alerts appear
- [ ] Login as officer, verify region-based alerts appear
- [ ] Test severity filter works correctly
- [ ] Test time range filter works correctly (7d/30d/90d)
- [ ] Test resolving an alert removes it from list

### API Endpoint Testing
- [ ] Test GET /health returns success
- [ ] Test all plot endpoints with valid/invalid data
- [ ] Test all alert endpoints with valid/invalid data
- [ ] Test analysis endpoints return proper data
- [ ] Test authentication endpoints work correctly

### Database Testing
- [ ] Verify all seeded data exists in Supabase
- [ ] Test farmer creation works
- [ ] Test plot creation works
- [ ] Test alert creation works
- [ ] Verify cascade delete works (delete farmer → plots delete too)

---

## 📝 FINAL SHOWCASE PREPARATION

### Step 1: Fix Critical Security Issues (2-3 hours)
```bash
# 1. Add password field to schema
cd backend
# Edit prisma/schema.prisma - add password String to Farmer model
npx prisma db push

# 2. Implement bcrypt hashing
# Edit backend/src/routes/authRoutes.ts
# Add bcrypt.hash on registration
# Add bcrypt.compare on login

# 3. Remove hardcoded officer accounts
# Delete OFFICER_ACCOUNTS array from authRoutes.ts
# Create Officer model in schema.prisma
# Move officers to seed.ts

# 4. Create auth middleware
# Create backend/src/middleware/auth.ts
# Apply to all routes in index.ts
```

### Step 2: Fix Non-Functional UI Elements (1-2 hours)
```bash
# 1. Remove emoji
# Edit frontend/src/pages/FarmerDashboard.tsx line 544
# Replace 🛰️ with "Satellite Imagery"

# 2. Fix or remove non-functional buttons
# Edit OfficerDashboard.tsx - remove or implement handlers
# Edit AlertsPage.tsx - remove or implement handlers

# 3. Fix mobile menu
# Edit Navigation.tsx - implement mobile menu toggle

# 4. Fix time range filter
# Edit AlertsPage.tsx - implement filtering logic

# 5. Remove cosmetic notification settings
# Edit AlertsPage.tsx - remove lines 309-332
```

### Step 3: Add Database Indexes (30 mins)
```bash
cd backend
# Edit prisma/schema.prisma - add indexes
npx prisma db push
```

### Step 4: Configure Vercel Environment Variables (15 mins)
- Go to Vercel Dashboard → Project → Settings → Environment Variables
- Add DATABASE_URL, NASA_API_KEY, OPENWEARY_API_KEY, JWT_SECRET
- Use values from SIH_SHOWCASE_MASTER_PROMPT.md

### Step 5: Verify Deployment (30 mins)
```bash
# Build locally
cd frontend
npm run build
cd backend
npm run build

# Push to GitHub
git add .
git commit -m "Final fixes for SIH showcase"
git push origin main

# Test production URL
# Verify all functionality works
```

### Step 6: Re-seed Database with Passwords (15 mins)
```bash
cd backend
# Update seed.ts to include bcrypt-hashed passwords
npx tsx prisma/seed.ts
```

---

## 🎯 SHOWCASE DEMONSTRATION FLOW

### Presentation Script (5 minutes)
1. **Introduction** (30 seconds)
   - Explain the problem: Farmers lack crop health monitoring
   - Show landing page
   - Highlight satellite imagery and weather data

2. **Officer Demo** (2 minutes)
   - Login: officer@gmail.com / 12345
   - Show regional data filtering (Nashik/Pune/All Maharashtra)
   - Show risk severity filtering
   - Show map with plot locations
   - Show alerts page with severity filtering

3. **Farmer Demo** (2 minutes)
   - Logout, login: farmer@gmail.com / 54321
   - Show personal plots (only their data)
   - Show alerts (only their alerts)
   - Click on plot, show analysis page
   - Show NDVI chart with 30-day trend
   - Show weather cards with 4 metrics
   - Show satellite imagery placeholder

4. **Technical Highlights** (30 seconds)
   - React + TypeScript frontend
   - Express + Prisma backend
   - PostgreSQL (Supabase) database
   - NASA + OpenWeather API integrations
   - JWT authentication
   - Leaflet maps, Recharts visualization

---

## 🚨 SHOWCASE KILLER ISSUES (AVOID THESE)

### DO NOT:
- ❌ Leave hardcoded credentials in code
- ❌ Show plaintext passwords
- ❌ Leave non-functional buttons visible
- ❌ Leave emojis in production code
- ❌ Leave mock/placeholder content visible
- ❌ Forget to test all user accounts
- ❌ Forget to configure Vercel environment variables
- ❌ Commit .env files with real credentials
- ❌ Use the demo credentials as production credentials

### MUST:
- ✅ Remove all hardcoded credentials from code
- ✅ Implement password hashing
- ✅ Add authentication/authorization middleware
- ✅ Fix or remove non-functional buttons
- ✅ Remove all emojis
- ✅ Configure all environment variables in Vautha
- ✅ Test all functionality in production
- ✅ Have stable database connection
- ✅ Practice the demo flow multiple times

---

## 📊 CURRENT SHOWCASE READINESS: 65%

**With critical fixes applied**: 85%
**With all enhancements applied**: 95%

**Time Required for 85% Readiness**: 4-5 hours
**Time Required for 95% Readiness**: 8-10 hours

---

## 🎁 ADDITIONAL FILES TO CREATE

### 1. Auth Middleware
**File**: `backend/src/middleware/auth.ts`
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key-change-in-production');
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

### 2. Officer Database Model
**File**: Add to `backend/prisma/schema.prisma`
```prisma
model Officer {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  region    String
  phone     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 3. Database Indexes
**File**: Add to `backend/prisma/schema.prisma`
```prisma
model Plot {
  ...
  @@index([farmerId])
  @@index([cropType])
}

model Alert {
  ...
  @@index([plotId])
  @@index([severity])
  @@index([timestamp])
}

model HistoricalData {
  ...
  @@index([plotId])
  @@index([date])
}
```

---

## 🔗 KEY FILE REFERENCES

### Critical Files to Edit
1. `backend/src/routes/authRoutes.ts` - Remove hardcoded credentials, add bcrypt
2. `backend/prisma/schema.prisma` - Add password field, Officer model, indexes
3. `backend/src/index.ts` - Add authentication middleware
4. `frontend/src/pages/FarmerDashboard.tsx` - Remove emoji, fix analysis page
5. `frontend/src/pages/OfficerDashboard.tsx - Fix or remove non-functional buttons
6. `frontend/src/pages/AlertsPage.tsx - Fix time filter, remove cosmetic section
7. `frontend/src/components/Navigation.tsx` - Fix mobile menu
8. `backend/.env` - Add DATABASE_URL, API keys (NEVER commit)

### Configuration Files
1. `vercel.json` - Verify only root exists
2. `backend/.env.example` - Update with password field
3. `frontend/.env` - Set production API URL for deployment

---

## 🚀 DEPLOYMENT COMMANDS

### Local Development
```bash
# Start backend
cd backend
npm start

# Start frontend (new terminal)
cd frontend
npm run dev
```

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build
```

### Database Migration
```bash
cd backend
npx prisma db push
npx tsx prisma/seed.ts
```

### Git Commands
```bash
git add .
git commit -m "SIH showcase fixes"
git push origin main
```

---

## 🎯 SUCCESS CRITERIA FOR SIH SHOWCASE

The project will be successful if:
1. ✅ No hardcoded credentials in code
2. ✅ Passwords are hashed (bcrypt implemented)
3. ✅ Authentication/authorization middleware works
4. ✅ All buttons are functional or removed
5. ✅ No emojis in production code
6. ✅ All user accounts work correctly
7. ✅ Data isolation is working (different users see different data)
8. ✅ Database connection is stable
9. ✅ API integrations work (or have proper fallbacks)
10. ✅ UI is professional and responsive
11. ✅ No non-functional features visible
12. ✅ Deployment is stable and accessible

---

## 📞 EMERGENCY FIXES FOR COMMON ISSUES

### Login Not Working
**Solution**: Check backend is running, check DATABASE_URL in Vercel, verify JWT_SECRET is set

### Data Not Loading
**Solution**: Check API routing in vercel.json, verify CORS configuration, check database connection

### Database Connection Failed
**Solution**: Verify DATABASE_URL is correct in Vercel, check Supabase status, ensure password is properly URL-encoded

### White Screen on Load
**Solution**: Check build output, verify frontend/dist is generated correctly, check Vercel build logs

### API Returns 404
**Solution**: Check API rewrites in vercel.json, verify api/index.ts exists, verify routes are registered

### Time Running Out
**Solution**: Check Vercel function timeout settings, optimize database queries, add caching

---

## 🏆 FINAL REMINDER

**This is your SIH showcase. Every detail matters.**
- Test everything multiple times
- Have backup accounts ready
- Know your talking points
- Be prepared for technical questions
- Show confidence in your implementation
- Highlight the real-world impact
- Emphasize the Maharashtra context

**Good luck with SIH2026! 🚀**

---

## 📚 DOCUMENTATION TO PREPARE

1. **Technical Architecture Document**: Explain system design, tech stack, data flow
2. **API Documentation**: List all endpoints with examples, request/response formats
3. **Database Schema**: Document all models, relationships, indexes
4. **User Guide**: How to use the application for farmers and officers
5. **Deployment Guide**: How to deploy to Vercel, environment variables setup
6. **Troubleshooting Guide**: Common issues and solutions

---

## 📈 PROJECT STATISTICS

- **Total Files**: ~34 source files
- **Backend Files**: 16 TypeScript files
- **Frontend Files**: 10 TypeScript/TSX files
- **Configuration Files**: 8 config files
- **API Endpoints**: 15+ endpoints
- **Database Models**: 4 models
- **Frontend Pages**: 6 pages
- **Integration Points**: 3 (NASA, OpenWeather, OpenStreetMap)

---

## 🎯 DEMO ACCOUNTS FOR SHOWCASE

### Officers (Password: 12345)
- officer@gmail.com (Nashik region)
- officer2@gmail.com (Pune region)
- officer3@gmail.com (All Maharashtra)

### Farmers (Password: 54321)
- farmer@gmail.com (Ramesh - 2 plots in Nashik)
- sunita.sharma@example.com (Sunita - 1 plot in Nashik)
- vijay.kumar@example.com (Vijay - 1 plot in Pune)

**NOTE**: These accounts are currently hardcoded in code - MUST be moved to database per security fixes above.

---

## 📌 CURRENT PROJECT STATUS

**Repository**: https://github.com/Gyanankur23/SIH2026.git
**Latest Commit**: a850dff (Add JWT authentication dependencies and auth routes to backend)
**Branch**: main
**Vercel Project**: sih2026 (to be configured)

**Key Strengths**:
- Well-structured codebase
- Clean separation of concerns
- Good use of TypeScript
- Professional UI design
- Comprehensive feature set
- Database seeded with Maharashtra-specific data

**Critical Weaknesses**:
- Hardcoded credentials (SECURITY RISK)
- No password hashing (SECURITY RISK)
- No authentication middleware (SECURITY RISK)
- Non-functional buttons (UX RISK)
- Emojis in code (PROFESSIONALISM RISK)
- Missing database indexes (PERFORMANCE RISK)

---

## 🎬 END OF MASTER PROMPT

This document provides a complete roadmap for making the SIH2026 project showcase-ready. Follow the checklist systematically and prioritize the critical security fixes first. The project has a solid foundation but requires attention to security and completeness before the showcase.

**Remember**: For SIH, security awareness and completeness are judged as seriously as functionality. Show your understanding of production-ready practices by implementing the critical fixes outlined above.

**Good luck! 🚀**
