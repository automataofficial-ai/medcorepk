# Admin Panel Setup Guide

## Overview
This guide explains how to:
1. Set up admin roles in the database
2. Create a secure admin panel (only admins can access)
3. Add/edit/delete blocks and MCQs
4. Protect admin endpoints

## Step 1: Add Admin Role to Users Table

Run this SQL in Supabase:

```sql
-- Add role column to users table
ALTER TABLE public.users ADD COLUMN role TEXT DEFAULT 'user';

-- Make your account admin
UPDATE public.users SET role = 'admin' WHERE email = 'your-email@example.com';

-- Check if it worked
SELECT id, email, role FROM public.users;
```

## Step 2: Update User Creation to Set Admin

When creating your first admin account, set role to 'admin' in the signup API.

## Step 3: Admin Panel Features

The admin panel will have:

✅ Block Management
  - View all blocks
  - Create new block
  - Edit block details
  - Delete block

✅ MCQ Management (per block)
  - View MCQs in block
  - Add new MCQ to block
  - Edit MCQ
  - Delete MCQ

✅ Admin Dashboard
  - Total blocks count
  - Total MCQs count
  - User management
  - Analytics

## Step 4: Security

Admin endpoints check:
1. User is authenticated
2. User has admin role
3. Request has valid auth token

## Access

- Admin Panel: `/admin/dashboard`
- Block Management: `/admin/blocks`
- User Management: `/admin/users` (coming soon)

