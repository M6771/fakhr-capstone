# Project Structure Mapping

Detailed mapping between the simplified `sanad-app/` structure and the current `Sanad-Capstone-Fronend/` implementation.

---

## 📁 Root Level Files

### Configuration Files

| File              | Simplified Structure         | Current Structure                    | Status      |
| ----------------- | ---------------------------- | ------------------------------------ | ----------- |
| `README.md`       | ✅ Setup/run instructions    | ✅ Complete with detailed docs       | ✅ Enhanced |
| `app.json`        | ✅ Expo configuration        | ✅ Present                           | ✅ Matches  |
| `babel.config.js` | ✅ Babel + path aliases      | ⚠️ Not present (using Expo defaults) | ⚠️ May need |
| `package.json`    | ✅ Dependencies + scripts    | ✅ Present                           | ✅ Matches  |
| `tsconfig.json`   | ✅ TypeScript + path mapping | ✅ Present with `@/*` alias          | ✅ Enhanced |

---

## 🎨 Design System

### Theme/Constants

| Simplified Structure        | Current Structure                           | Status      |
| --------------------------- | ------------------------------------------- | ----------- |
| `constants/theme.ts`        | `theme/` (modular)                          | ✅ Enhanced |
| Single file with all tokens | Separate files:                             |             |
|                             | - `theme/colors.ts`                         |             |
|                             | - `theme/spacing.ts`                        |             |
|                             | - `theme/typography.ts`                     |             |
|                             | - `theme/radius.ts`                         |             |
|                             | - `theme/index.ts`                          |             |
|                             | `constants/theme.ts` (deprecated re-export) |             |

**Purpose**: Design tokens (colors, spacing, typography)

**Current Implementation**:

- ✅ More maintainable modular structure
- ✅ Better separation of concerns
- ✅ Backward compatible via `constants/theme.ts` re-export

---

## 🔄 State Management

### Contexts

| Simplified Structure       | Current Structure             | Status        |
| -------------------------- | ----------------------------- | ------------- |
| `contexts/AuthContext.tsx` | `context/AuthContext.tsx`     | ✅ Matches    |
|                            | `context/LanguageContext.tsx` | ➕ Additional |

**Purpose**: Auth state management with React Context

**Current Implementation**:

- ✅ Same functionality
- ✅ Additional LanguageContext (English-only currently)
- ⚠️ Different directory name (`context/` vs `contexts/`)

---

## 🪝 Custom Hooks

| Simplified Structure      | Current Structure         | Status        |
| ------------------------- | ------------------------- | ------------- |
| `hooks/useActiveChild.ts` | `hooks/useActiveChild.ts` | ✅ Matches    |
|                           | `hooks/useAuth.ts`        | ➕ Additional |

**Purpose**: Hook returning the active child (mocked/default)

**Current Implementation**:

- ✅ Same functionality
- ✅ Additional `useAuth` hook wrapper

---

## 📱 App Routes

### Root Layout

| Simplified Structure | Current Structure                                     | Status      |
| -------------------- | ----------------------------------------------------- | ----------- |
| `app/_layout.tsx`    | `app/_layout.tsx`                                     | ✅ Matches  |
| Stack + AuthProvider | Stack + AuthProvider + LanguageProvider + QueryClient | ✅ Enhanced |

**Purpose**: Root layout (Stack + AuthProvider)

**Current Implementation**:

- ✅ Same base structure
- ✅ Additional providers (Language, QueryClient)

---

### Entry Point

| Simplified Structure | Current Structure                           | Status      |
| -------------------- | ------------------------------------------- | ----------- |
| `app/index.tsx`      | `app/index.tsx`                             | ✅ Matches  |
| Redirect to Home tab | Redirect to onboarding (if no user) or home | ✅ Enhanced |

**Purpose**: Entry point redirect

**Current Implementation**:

- ✅ Enhanced with auth check
- ✅ Redirects to onboarding if no user
- ✅ Redirects to home if authenticated

---

### Authentication Routes

| Simplified Structure     | Current Structure                | Status                     |
| ------------------------ | -------------------------------- | -------------------------- |
| `app/login.tsx`          | `app/(auth)/login.tsx`           | ⚠️ Different location      |
| `app/create-account.tsx` | `app/(auth)/register.tsx`        | ⚠️ Different name/location |
|                          | `app/(auth)/forgot-password.tsx` | ➕ Additional              |

**Purpose**:

- Login screen UI and logic
- Registration screen UI and logic

**Current Implementation**:

- ✅ Same functionality
- ✅ Better organization with `(auth)` route group
- ✅ Additional forgot password flow
- ⚠️ Different file names (`register.tsx` vs `create-account.tsx`)

---

### Onboarding

| Simplified Structure | Current Structure             | Status        |
| -------------------- | ----------------------------- | ------------- |
| `app/onboarding.tsx` | `app/(onboarding)/` (8 files) | ⚠️ Multi-step |

**Purpose**: Onboarding screen (generate plan → Home)

**Current Implementation**:

- ✅ Enhanced multi-step flow:
  - `landing.tsx` - Landing/onboarding intro
  - `parent-profile.tsx` - Parent information
  - `child-basic.tsx` - Child basic info
  - `child-medical.tsx` - Child medical info
  - `child-diagnosis.tsx` - Child diagnosis
  - `child-challenges.tsx` - Child challenges
  - `child-goals.tsx` - Child goals
  - `generate-plan.tsx` - Generate care plan
- ✅ Better UX with progress tracking
- ✅ Form validation per step

---

### Main App Tabs

| Simplified Structure     | Current Structure        | Status     |
| ------------------------ | ------------------------ | ---------- |
| `app/(tabs)/_layout.tsx` | `app/(tabs)/_layout.tsx` | ✅ Matches |
| Tabs navigation setup    | Tabs navigation setup    | ✅ Matches |

**Purpose**: Tabs navigation setup

---

#### Home Tab

| Simplified Structure        | Current Structure           | Status     |
| --------------------------- | --------------------------- | ---------- |
| `app/(tabs)/home/index.tsx` | `app/(tabs)/home/index.tsx` | ✅ Matches |

**Purpose**: Home screen (mood, child info, quick actions)

**Current Implementation**:

- ✅ Complete with:
  - Greeting header
  - Mood selector chips
  - Child selector card
  - Weekly plan progress
  - Today's focus task
  - Recommended content
  - Quick actions grid

---

#### Care Path Tab

| Simplified Structure        | Current Structure                  | Status        |
| --------------------------- | ---------------------------------- | ------------- |
| `app/(tabs)/plan/index.tsx` | `app/(tabs)/plan/index.tsx`        | ✅ Matches    |
|                             | `app/(tabs)/plan/_layout.tsx`      | ➕ Additional |
|                             | `app/(tabs)/plan/task-details.tsx` | ➕ Additional |
|                             | `app/(tabs)/plan/check-in.tsx`     | ➕ Additional |
|                             | `app/(tabs)/plan/progress.tsx`     | ➕ Additional |

**Purpose**: Care path screen

**Current Implementation**:

- ✅ Main screen with empty state
- ✅ Additional sub-screens for details, check-in, progress
- ✅ Stack layout with back button styling

---

#### Documents Tab

| Simplified Structure             | Current Structure                          | Status            |
| -------------------------------- | ------------------------------------------ | ----------------- |
| `app/(tabs)/documents/index.tsx` | `app/(tabs)/resources/index.tsx`           | ⚠️ Different name |
|                                  | `app/(tabs)/resources/_layout.tsx`         | ➕ Additional     |
|                                  | `app/(tabs)/resources/content-details.tsx` | ➕ Additional     |

**Purpose**: Documents screen

**Current Implementation**:

- ✅ Same functionality (empty state with upload CTA)
- ⚠️ Named `resources/` instead of `documents/` (more generic)
- ✅ Additional content details screen

---

#### Community Tab

| Simplified Structure             | Current Structure                      | Status        |
| -------------------------------- | -------------------------------------- | ------------- |
| `app/(tabs)/community/index.tsx` | `app/(tabs)/community/index.tsx`       | ✅ Matches    |
|                                  | `app/(tabs)/community/_layout.tsx`     | ➕ Additional |
|                                  | `app/(tabs)/community/create-post.tsx` | ➕ Additional |
|                                  | `app/(tabs)/community/events.tsx`      | ➕ Additional |

**Purpose**: Community screen

**Current Implementation**:

- ✅ Same base screen (empty state)
- ✅ Additional screens for creating posts and viewing events
- ✅ Stack layout with back button styling

---

#### Profile Tab

| Simplified Structure           | Current Structure                        | Status        |
| ------------------------------ | ---------------------------------------- | ------------- |
| `app/(tabs)/profile/index.tsx` | `app/(tabs)/profile/index.tsx`           | ✅ Matches    |
|                                | `app/(tabs)/profile/_layout.tsx`         | ➕ Additional |
|                                | `app/(tabs)/profile/manage-children.tsx` | ➕ Additional |
|                                | `app/(tabs)/profile/settings.tsx`        | ➕ Additional |

**Purpose**: Profile screen

**Current Implementation**:

- ✅ Complete profile screen with:
  - User card
  - Manage children card
  - Settings toggles
  - List items
  - Sign out button
- ✅ Additional screens for managing children and settings
- ✅ Stack layout with back button styling

---

## 📊 Additional Features in Current Project

### Components

- ✅ `components/ui/` - Reusable UI components (Button, Card, Input, Toggle, Chip, Avatar, etc.)

### API Layer

- ✅ `api/` - API client functions (auth, care-path, community, content, directory)

### Types

- ✅ `types/` - TypeScript type definitions

### Utils

- ✅ `utils/` - Helper and validator functions

### Internationalization

- ✅ `i18n/` - i18n configuration (currently English-only)

### Documentation

- ✅ Multiple documentation files (README, guides, checklists)

---

## 🔄 Route Comparison

### Simplified Routes

```
/ → Home tab
/login → Login
/create-account → Registration
/onboarding → Onboarding
/(tabs)/home → Home
/(tabs)/plan → Care Path
/(tabs)/documents → Documents
/(tabs)/community → Community
/(tabs)/profile → Profile
```

### Current Routes

```
/ → Redirects to onboarding (if no user) or home (if authenticated)
/(onboarding)/landing → Landing screen
/(auth)/login → Login
/(auth)/register → Create account
/(auth)/forgot-password → Forgot password
/(tabs)/home → Home
/(tabs)/plan → Care Path
/(tabs)/resources → Documents (named resources)
/(tabs)/community → Community
/(tabs)/profile → Profile
```

---

## ✅ Summary

### What Matches

- ✅ Core functionality
- ✅ All main screens implemented
- ✅ Design system (enhanced)
- ✅ Authentication flow
- ✅ Tab navigation

### Enhancements in Current Project

- ✅ Better route organization (route groups)
- ✅ Multi-step onboarding (8 screens vs 1)
- ✅ Modular design system
- ✅ Additional screens and features
- ✅ Better TypeScript organization
- ✅ Comprehensive documentation
- ✅ Reusable UI components
- ✅ API layer
- ✅ Type definitions

### Differences

- ⚠️ Route organization (groups vs flat)
- ⚠️ Onboarding (multi-step vs single)
- ⚠️ Theme structure (modular vs single file)
- ⚠️ Context directory name (`context/` vs `contexts/`)
- ⚠️ Documents route name (`resources/` vs `documents/`)

---

## 🎯 Recommendation

**Keep Current Enhanced Structure** - It provides:

1. Better organization
2. More maintainable code
3. Enhanced user experience
4. Production-ready architecture
5. Follows React Native/Expo best practices

The simplified structure works but loses organizational benefits and features.

---

_Last Updated: [Current Date]_
