const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need to add this to your .env

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration. Please check your .env file.');
  console.error('Required variables:');
  console.error('- REACT_APP_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('Setting up Supabase database...');

    // Read and execute the schema
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`Executing ${statements.length} SQL statements...`);

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          if (error) {
            console.warn(`Warning executing statement: ${error.message}`);
          }
        } catch (err) {
          console.warn(`Warning: ${err.message}`);
        }
      }
    }

    console.log('Database setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Create your first admin user by signing up through the app');
    console.log('2. Update the user role to "Admin" in the Supabase dashboard');
    console.log('3. Start using the application!');

  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

// Alternative setup using direct SQL execution
async function setupDatabaseDirect() {
  try {
    console.log('Setting up Supabase database (direct method)...');
    
    // Create a function to execute SQL
    const { error: functionError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION exec_sql(sql text)
        RETURNS void AS $$
        BEGIN
          EXECUTE sql;
        END;
        $$ LANGUAGE plpgsql;
      `
    });

    if (functionError) {
      console.warn('Function creation warning:', functionError.message);
    }

    // Execute the schema
    await setupDatabase();

  } catch (error) {
    console.error('Error in direct setup:', error);
    console.log('\nManual setup required:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of database/schema.sql');
    console.log('4. Execute the SQL');
  }
}

// Run the setup
if (require.main === module) {
  setupDatabaseDirect();
}

module.exports = { setupDatabase, setupDatabaseDirect };
