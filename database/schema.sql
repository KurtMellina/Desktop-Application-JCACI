-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT CHECK (role IN ('Admin', 'Teacher', 'Staff')) DEFAULT 'Teacher',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  grade TEXT NOT NULL,
  section TEXT NOT NULL,
  status TEXT CHECK (status IN ('Active', 'Inactive', 'Graduated')) DEFAULT 'Active',
  enrollment_date DATE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  phone TEXT,
  hire_date DATE NOT NULL,
  status TEXT CHECK (status IN ('Active', 'Inactive', 'On Leave')) DEFAULT 'Active',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('Present', 'Absent', 'Late', 'Excused')) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- Create grades table
CREATE TABLE IF NOT EXISTS grades (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  grade DECIMAL(5,2) NOT NULL,
  max_grade DECIMAL(5,2) NOT NULL DEFAULT 100,
  semester TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create billing table
CREATE TABLE IF NOT EXISTS billing (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT CHECK (status IN ('Pending', 'Paid', 'Overdue', 'Cancelled')) DEFAULT 'Pending',
  payment_date DATE,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create app_settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_billing_updated_at BEFORE UPDATE ON billing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON app_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default app settings
INSERT INTO app_settings (key, value) VALUES
  ('school_name', '"Jolly Children Academic Center"'),
  ('school_address', '"123 Education Street, Learning City, LC 12345"'),
  ('school_phone', '"+1 (555) 123-4567"'),
  ('school_email', '"info@jollychildren.edu"'),
  ('school_website', '"www.jollychildren.edu"'),
  ('academic_year', '"2024-2025"'),
  ('currency', '"PHP"'),
  ('timezone', '"America/New_York"'),
  ('language', '"English"'),
  ('notifications', '{"email": true, "sms": false, "push": true}'),
  ('backup', '{"autoBackup": true, "backupFrequency": "Daily", "cloudStorage": true}')
ON CONFLICT (key) DO NOTHING;

-- Insert sample students data
INSERT INTO students (first_name, last_name, email, grade, section, status, enrollment_date) VALUES
  ('Sarah', 'Johnson', 'sarah.johnson@email.com', '5', 'A', 'Active', '2023-09-01'),
  ('Michael', 'Wilson', 'michael.wilson@email.com', '4', 'B', 'Active', '2023-09-01'),
  ('Emily', 'Davis', 'emily.davis@email.com', '6', 'A', 'Active', '2023-09-01'),
  ('James', 'Brown', 'james.brown@email.com', '3', 'C', 'Inactive', '2023-09-01'),
  ('Olivia', 'Miller', 'olivia.miller@email.com', '7', 'A', 'Active', '2023-09-01')
ON CONFLICT (email) DO NOTHING;

-- Insert sample staff data
INSERT INTO staff (first_name, last_name, email, role, department, phone, hire_date, status) VALUES
  ('John', 'Smith', 'john.smith@jollychildren.edu', 'Principal', 'Administration', '+1 (555) 123-4567', '2020-01-15', 'Active'),
  ('Mary', 'Johnson', 'mary.johnson@jollychildren.edu', 'Teacher', 'Elementary', '+1 (555) 123-4568', '2021-08-20', 'Active'),
  ('David', 'Brown', 'david.brown@jollychildren.edu', 'Teacher', 'Mathematics', '+1 (555) 123-4569', '2019-09-01', 'Active'),
  ('Lisa', 'Wilson', 'lisa.wilson@jollychildren.edu', 'Counselor', 'Student Services', '+1 (555) 123-4570', '2022-01-10', 'Active')
ON CONFLICT (email) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to create new users (for admin functionality)
CREATE POLICY "Authenticated users can create users" ON users
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to delete users (for admin functionality)
CREATE POLICY "Authenticated users can delete users" ON users
  FOR DELETE USING (auth.role() = 'authenticated');

-- For now, allow all authenticated users to access all data
-- In production, you should create more restrictive policies based on roles
CREATE POLICY "Authenticated users can access students" ON students
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access staff" ON staff
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access attendance" ON attendance
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access grades" ON grades
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access billing" ON billing
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can access app_settings" ON app_settings
  FOR ALL USING (auth.role() = 'authenticated');
