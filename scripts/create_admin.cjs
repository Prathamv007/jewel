const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/aurelia";

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: { type: String, select: false },
  role: { type: String, enum: ['client', 'admin'], default: 'client' },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Check if admin exists
    const existing = await User.findOne({ email: 'admin@aurelia.com' });
    if (!existing) {
      await User.create({
        firstName: 'Aurelia',
        lastName: 'Admin',
        email: 'admin@aurelia.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Admin user created: admin@aurelia.com / admin123');
    } else {
      console.log('Admin already exists.');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();
