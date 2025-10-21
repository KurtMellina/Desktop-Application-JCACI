-- Migration script to update staff status constraint
-- This script adds 'On Leave' as a valid status option

-- Drop the existing constraint
ALTER TABLE staff DROP CONSTRAINT IF EXISTS staff_status_check;

-- Add the new constraint with 'On Leave' included
ALTER TABLE staff ADD CONSTRAINT staff_status_check CHECK (status IN ('Active', 'Inactive', 'On Leave'));

-- Verify the constraint was added
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname = 'staff_status_check' 
AND conrelid = 'staff'::regclass;
