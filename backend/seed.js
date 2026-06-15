require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Service = require('./models/Service');

const seed = async () => {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@workshop.com';
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
    });
    console.log('Admin user created:', adminEmail);
  } else {
    console.log('Admin already exists:', adminEmail);
  }

  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany([
      { name: 'Oil Change', description: 'Full synthetic oil change with filter replacement', price: 3000, duration: 30 },
      { name: 'Brake Service', description: 'Brake pad inspection and replacement', price: 5000, duration: 60 },
      { name: 'Tire Rotation', description: 'Rotate and balance all four tires', price: 1500, duration: 30 },
      { name: 'Engine Diagnostic', description: 'Complete engine health check', price: 2500, duration: 45 },
    ]);
    console.log('Sample services created');
  }

  console.log('Seed completed');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
