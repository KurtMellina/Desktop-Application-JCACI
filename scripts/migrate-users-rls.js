// Migration script to fix RLS policies for users table
// Run this script to fix the RLS policy issue when adding users

import { supabaseClient } from '../src/lib/supabase.js';

async function migrateUsersRLSPolicies() {
  try {
    console.log('Starting users RLS policies migration...');
    
    // Drop existing policies if they exist (to avoid conflicts)
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Users can view own profile" ON users;',
      'DROP POLICY IF EXISTS "Users can update own profile" ON users;'
    ];
    
    for (const sql of dropPolicies) {
      const { error } = await supabaseClient.rpc('exec_sql', { sql });
      if (error) {
        console.warn('Warning: Could not drop policy:', error.message);
      }
    }
    
    // Recreate the original policies
    const recreatePolicies = [
      `CREATE POLICY "Users can view own profile" ON users
        FOR SELECT USING (auth.uid() = id);`,
      `CREATE POLICY "Users can update own profile" ON users
        FOR UPDATE USING (auth.uid() = id);`
    ];
    
    for (const sql of recreatePolicies) {
      const { error } = await supabaseClient.rpc('exec_sql', { sql });
      if (error) {
        console.error('Error recreating policy:', error.message);
        throw error;
      }
    }
    
    // Add the missing policies for INSERT and DELETE
    const newPolicies = [
      `CREATE POLICY "Authenticated users can create users" ON users
        FOR INSERT WITH CHECK (auth.role() = 'authenticated');`,
      `CREATE POLICY "Authenticated users can delete users" ON users
        FOR DELETE USING (auth.role() = 'authenticated');`
    ];
    
    for (const sql of newPolicies) {
      const { error } = await supabaseClient.rpc('exec_sql', { sql });
      if (error) {
        console.error('Error creating new policy:', error.message);
        throw error;
      }
    }
    
    console.log('✅ Users RLS policies migration completed successfully!');
    console.log('Users can now be created and deleted by authenticated users');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\nManual fix required:');
    console.log('Run this SQL command in your database:');
    console.log('DROP POLICY IF EXISTS "Users can view own profile" ON users;');
    console.log('DROP POLICY IF EXISTS "Users can update own profile" ON users;');
    console.log('CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);');
    console.log('CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);');
    console.log('CREATE POLICY "Authenticated users can create users" ON users FOR INSERT WITH CHECK (auth.role() = \'authenticated\');');
    console.log('CREATE POLICY "Authenticated users can delete users" ON users FOR DELETE USING (auth.role() = \'authenticated\');');
  }
}

// Run the migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateUsersRLSPolicies();
}

export { migrateUsersRLSPolicies };
