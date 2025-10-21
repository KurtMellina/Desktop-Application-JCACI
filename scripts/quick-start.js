#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Jolly Children Academic Center - Supabase Quick Start');
console.log('=====================================================\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created from template');
  } else {
    // Create basic .env file
    const envContent = `# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Example:
# REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
# REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created with template');
  }
  
  console.log('\n⚠️  IMPORTANT: Please update your .env file with your Supabase credentials!');
  console.log('   - Get your credentials from: https://supabase.com/dashboard');
  console.log('   - Update REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY');
} else {
  console.log('✅ .env file already exists');
}

// Check if node_modules exists
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('\n📦 Installing dependencies...');
  console.log('   Run: npm install');
} else {
  console.log('✅ Dependencies are installed');
}

console.log('\n📋 Next Steps:');
console.log('1. Set up your Supabase project:');
console.log('   - Go to https://supabase.com');
console.log('   - Create a new project');
console.log('   - Get your Project URL and anon key');
console.log('   - Update your .env file with these values');

console.log('\n2. Set up the database:');
console.log('   - Follow the SUPABASE_SETUP.md guide');
console.log('   - Or run: npm run setup-supabase (after adding service key)');

console.log('\n3. Start the application:');
console.log('   - Run: npm start');
console.log('   - Login with demo credentials:');
console.log('     Admin: admin@jollychildren.edu / admin123');
console.log('     Teacher: teacher@jollychildren.edu / teacher123');

console.log('\n📚 Documentation:');
console.log('   - SUPABASE_SETUP.md - Complete setup guide');
console.log('   - MIGRATION_GUIDE.md - Migration from localStorage');
console.log('   - README.md - General project information');

console.log('\n🎉 Happy coding!');
