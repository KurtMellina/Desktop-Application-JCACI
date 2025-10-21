// Migration script to update staff status constraint
// Run this script to fix the staff status constraint issue

import { supabaseClient } from '../src/lib/supabase.js';

async function migrateStaffStatusConstraint() {
  try {
    console.log('Starting staff status constraint migration...');
    
    // Drop the existing constraint
    const { error: dropError } = await supabaseClient.rpc('exec_sql', {
      sql: `ALTER TABLE staff DROP CONSTRAINT IF EXISTS staff_status_check;`
    });
    
    if (dropError) {
      console.warn('Warning: Could not drop existing constraint:', dropError.message);
    }
    
    // Add the new constraint with 'On Leave' included
    const { error: addError } = await supabaseClient.rpc('exec_sql', {
      sql: `ALTER TABLE staff ADD CONSTRAINT staff_status_check CHECK (status IN ('Active', 'Inactive', 'On Leave'));`
    });
    
    if (addError) {
      console.error('Error adding new constraint:', addError.message);
      throw addError;
    }
    
    console.log('✅ Staff status constraint migration completed successfully!');
    console.log('Staff can now have status: Active, Inactive, or On Leave');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\nManual fix required:');
    console.log('Run this SQL command in your database:');
    console.log('ALTER TABLE staff DROP CONSTRAINT IF EXISTS staff_status_check;');
    console.log('ALTER TABLE staff ADD CONSTRAINT staff_status_check CHECK (status IN (\'Active\', \'Inactive\', \'On Leave\'));');
  }
}

// Run the migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateStaffStatusConstraint();
}

export { migrateStaffStatusConstraint };
