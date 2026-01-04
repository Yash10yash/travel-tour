import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model.js';

dotenv.config();

const resetAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel_tour');
    console.log('✅ Connected to MongoDB');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@traveltour.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin@123';

    // Find existing admin
    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log('📝 Found existing admin user, updating password...');
      admin.password = adminPassword;
      admin.role = 'admin';
      admin.isEmailVerified = true;
      await admin.save();
      console.log('✅ Admin password updated successfully!');
    } else {
      // Check if any admin exists
      const anyAdmin = await User.findOne({ role: 'admin' });
      if (anyAdmin) {
        console.log('⚠️  Admin exists with different email:', anyAdmin.email);
        console.log('   Updating to new email and password...');
        anyAdmin.email = adminEmail;
        anyAdmin.password = adminPassword;
        anyAdmin.isEmailVerified = true;
        await anyAdmin.save();
        console.log('✅ Admin updated successfully!');
      } else {
        // Create new admin
        console.log('📝 Creating new admin user...');
        admin = await User.create({
          name: 'Admin',
          email: adminEmail,
          password: adminPassword,
          role: 'admin',
          isEmailVerified: true
        });
        console.log('✅ Admin user created successfully!');
      }
    }

    console.log('\n📋 Admin Login Credentials:');
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
    console.log('\n✅ You can now login with these credentials!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting admin:', error);
    process.exit(1);
  }
};

resetAdmin();

