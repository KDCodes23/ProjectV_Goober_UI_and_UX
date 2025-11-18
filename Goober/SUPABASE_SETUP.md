# Supabase Setup Guide for Goober

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: Goober
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
5. Click "Create new project"

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## Step 3: Configure Environment Variables

1. Create a `.env` file in the root of your project (copy from `.env.example`)
2. Add your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `database/schema.sql`
3. Paste and run the SQL script
4. This will create all necessary tables, indexes, and security policies

## Step 5: Configure Authentication

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Enable **Email** provider (should be enabled by default)
3. Configure email templates if needed

## Step 6: Set Up Row Level Security (RLS)

The schema.sql file already includes RLS policies, but verify they're active:
1. Go to **Authentication** → **Policies**
2. Ensure all tables have RLS enabled
3. Verify policies are created correctly

## Step 7: Test the Connection

1. Start your app: `npm start`
2. Try to sign up a new user
3. Check Supabase dashboard → **Authentication** → **Users** to see if user was created
4. Check **Table Editor** → **profiles** to see if profile was created

## Additional Configuration

### SMS Verification (Optional)
To enable SMS verification for 2FA:
1. Go to **Authentication** → **Providers**
2. Enable **Phone** provider
3. Configure Twilio or your SMS provider
4. Update `supabaseService.ts` to use real SMS sending

### Email Verification (Optional)
1. Go to **Authentication** → **Email Templates**
2. Customize verification email templates
3. Configure SMTP settings if using custom email service

## Troubleshooting

- **"Invalid API key"**: Check that your `.env` file has correct values
- **"RLS policy violation"**: Ensure you're logged in and policies are set correctly
- **"Table does not exist"**: Run the schema.sql script again
- **Location permissions**: Make sure you've granted location permissions on your device

## Next Steps

- Set up real-time subscriptions for ride updates
- Configure push notifications
- Set up payment processing (Stripe, etc.)
- Configure SMS service for phone verification

