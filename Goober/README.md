# Goober - Ride-Sharing App

A full-featured ride-sharing application built with React Native, Expo, and Supabase.

## Project Structure

```
Goober/
├── assets/                 # Images, icons, and static assets
├── components/             # Reusable UI components
│   └── LiveMap.tsx        # Live map component with location tracking
├── config/                 # Configuration files
│   └── supabase.ts        # Supabase client configuration
├── contexts/               # React Context providers
│   ├── UserContext.tsx    # User authentication and profile state
│   ├── RideContext.tsx    # Ride booking and active ride state
│   └── RegistrationContext.tsx  # Registration flow state
├── database/               # Database schema and migrations
│   └── schema.sql         # Complete Supabase database schema
├── screens/                # Application screens
│   ├── auth/              # Authentication screens
│   │   ├── Splash.tsx
│   │   ├── Welcome.tsx
│   │   ├── SignIn.tsx
│   │   ├── SignUp.tsx
│   │   ├── TwoFactorAuth.tsx
│   │   └── registration/  # Registration flow screens
│   │       ├── EnterName.tsx
│   │       ├── EnterContact.tsx
│   │       ├── EnterEmail.tsx
│   │       ├── EmailVerification.tsx
│   │       └── CreatePassword.tsx
│   ├── booking/           # Ride booking screens
│   │   ├── SelectLocation.tsx
│   │   ├── SelectDate.tsx
│   │   ├── SelectTime.tsx
│   │   ├── SelectSeats.tsx
│   │   ├── BookRide.tsx
│   │   ├── AvailableRides.tsx
│   │   ├── TripDetails.tsx
│   │   ├── TripGoldenRules.tsx
│   │   ├── BookingConfirmed.tsx
│   │   ├── LookingForRides.tsx
│   │   └── OtherPassengers.tsx
│   ├── ride/              # Active ride screens
│   │   ├── BookingAccepted.tsx
│   │   ├── DriverEnRoute.tsx
│   │   ├── DriverArrived.tsx
│   │   ├── InTripMap.tsx
│   │   ├── RideCompleted.tsx
│   │   ├── RideRating.tsx
│   │   └── LeaveComment.tsx
│   ├── profile/           # Profile and settings screens
│   │   ├── Profile.tsx
│   │   └── Payment.tsx
│   └── Home.tsx           # Main home screen
├── services/               # Business logic and API services
│   ├── supabaseService.ts # Supabase database operations
│   └── mapService.ts      # Location and mapping services
├── types/                  # TypeScript type definitions
│   └── navigation.ts      # Navigation types
├── App.tsx                 # Main app component with navigation
├── index.ts                # App entry point
└── package.json            # Dependencies and scripts
```

## Features

- ✅ User Authentication (Sign In/Sign Up)
- ✅ Two-Factor Authentication (2FA)
- ✅ Profile Verification (Email & Phone)
- ✅ Live Map with Real-Time Location Tracking
- ✅ Ride Booking Flow
- ✅ Active Ride Tracking
- ✅ Payment Management
- ✅ User Reviews and Ratings
- ✅ Supabase Database Integration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Supabase account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Supabase:
   - Create a project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env` file:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. Run database schema:
   - Go to Supabase SQL Editor
   - Copy and run `database/schema.sql`

4. Start the app:
```bash
npm start
```

For more detailed setup instructions, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

## Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web

## Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **Supabase** - Backend (Database, Auth, Storage)
- **React Navigation** - Navigation
- **React Native Maps** - Maps integration
- **Expo Location** - Location services

## License

0BSD

