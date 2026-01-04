import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model.js';

dotenv.config();

const checkAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel_tour');
    console.log('✅ Connected to MongoDB');

    // Find all admin users
    const admins = await User.find({ role: 'admin' }).select('name email role isEmailVerified');
    
    if (admins.length === 0) {
      console.log('❌ No admin user found in database!');
      console.log('\n💡 To create an admin user, run:');
      console.log('   cd server');
      console.log('   npm run init-admin');
    } else {
      console.log(`\n✅ Found ${admins.length} admin user(s):\n`);
      admins.forEach((admin, index) => {
        console.log(`Admin ${index + 1}:`);
        console.log(`  Email: ${admin.email}`);
        console.log(`  Name: ${admin.name}`);
        console.log(`  Role: ${admin.role}`);
        console.log(`  Email Verified: ${admin.isEmailVerified}`);
        console.log('');
      });
      
      console.log('📝 Login credentials:');
      console.log(`  Email: ${admins[0].email}`);
      console.log(`  Password: (check your .env file for ADMIN_PASSWORD)`);
      console.log(`  Or use the default: admin@123`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking admin:', error);
    process.exit(1);
  }
};

checkAdmin();

