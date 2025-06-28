const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing TypeScript errors...');

try {
  // Check if we're in the backend directory
  if (!fs.existsSync('prisma/schema.prisma')) {
    console.log('❌ Please run this script from the backend directory');
    process.exit(1);
  }

  console.log('📦 Regenerating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('✅ Prisma client regenerated successfully!');
  console.log('🚀 You can now run: npm run dev');
  
} catch (error) {
  console.error('❌ Error fixing TypeScript errors:', error.message);
  process.exit(1);
} 