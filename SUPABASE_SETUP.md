# Supabase Integration Setup Guide

This guide will help you connect your Jolly Children Academic Center desktop application with Supabase as the database backend.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. Your React application set up

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `jolly-children-academic-center`
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
5. Click "Create new project"
6. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 3: Configure Environment Variables

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add your Supabase credentials:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Replace the placeholder values with your actual Supabase credentials.

## Step 4: Set Up the Database Schema

### Option A: Using the SQL Editor (Recommended)

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `database/schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

### Option B: Using the Setup Script

1. Install the required dependencies:
```bash
npm install dotenv
```

2. Add your service role key to your `.env` file:
```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

3. Run the setup script:
```bash
node scripts/setup-supabase.js
```

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following settings:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add `http://localhost:3000` for development
3. Go to **Authentication** → **Users** to manage user accounts

## Step 6: Create Demo Users

The application includes demo users for testing. You can create them by:

1. Going to **Authentication** → **Users** in your Supabase dashboard
2. Click "Add user"
3. Create the following users:

**Admin User:**
- Email: `admin@jollychildren.edu`
- Password: `admin123`
- Confirm email: Yes

**Teacher User:**
- Email: `teacher@jollychildren.edu`
- Password: `teacher123`
- Confirm email: Yes

## Step 7: Update User Roles

After creating the users, you need to update their roles in the database:

1. Go to **Table Editor** → **users**
2. Find the users you created
3. Update the `role` field:
   - Set `admin@jollychildren.edu` role to `Admin`
   - Set `teacher@jollychildren.edu` role to `Teacher`

## Step 8: Test the Integration

1. Start your React application:
```bash
npm start
```

2. Try logging in with the demo credentials:
   - Admin: `admin@jollychildren.edu` / `admin123`
   - Teacher: `teacher@jollychildren.edu` / `teacher123`

3. Verify that you can:
   - View the dashboard
   - See student data
   - Navigate between different sections

## Database Schema Overview

The application uses the following main tables:

- **users**: Authentication and user profiles
- **students**: Student information and enrollment data
- **staff**: Staff and teacher information
- **attendance**: Daily attendance records
- **grades**: Student grades and academic records
- **billing**: Tuition and fee management
- **app_settings**: Application configuration

## Security Features

- **Row Level Security (RLS)**: Enabled on all tables
- **Authentication**: Integrated with Supabase Auth
- **Data Validation**: Database constraints and checks
- **API Security**: Anon key for client-side access

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**:
   - Check that your `.env` file has the correct Supabase URL and anon key
   - Make sure the `.env` file is in the project root
   - Restart your development server after adding environment variables

2. **"Failed to load students" error**:
   - Verify that the database schema has been executed successfully
   - Check that the `students` table exists in your Supabase dashboard
   - Ensure RLS policies are properly configured

3. **Authentication not working**:
   - Verify that the demo users exist in the Supabase dashboard
   - Check that the users have the correct roles assigned
   - Ensure the site URL is configured in Authentication settings

### Getting Help

- Check the Supabase documentation: [docs.supabase.com](https://docs.supabase.com)
- Review the application logs in the browser console
- Check the Supabase dashboard for any error messages

## Production Deployment

When deploying to production:

1. Update the **Site URL** in Supabase Authentication settings
2. Add your production domain to **Redirect URLs**
3. Consider using environment-specific database instances
4. Review and tighten RLS policies for production use
5. Set up proper backup and monitoring

## Next Steps

After successful setup, you can:

1. Customize the database schema for your specific needs
2. Add more user roles and permissions
3. Implement additional features like file uploads
4. Set up automated backups
5. Configure monitoring and alerts

Your Jolly Children Academic Center application is now connected to Supabase! 🎉
