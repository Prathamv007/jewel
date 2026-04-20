const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/aurelia";

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  material: String,
  gemstone: String,
  description: String,
  images: [String],
  featured: Boolean,
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const INITIAL_MASTERPIECES = [
  {
    name: "The Heritage Solitaire Diamond",
    price: 18500,
    category: "Rings",
    material: "Platinum",
    gemstone: "2.5ct D-Flawless Diamond",
    description: "A testament to the Earth’s most enduring masterpiece. Handcrafted with architectural precision.",
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop"],
    featured: true
  },
  {
    name: "Luminescence Platinum Necklace",
    price: 42000,
    category: "Necklaces",
    material: "950 Platinum",
    gemstone: "15ct Graduated Diamonds",
    description: "A cascading river of white light. Handcrafted for the collection.",
    images: ["https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2070&auto=format&fit=crop"],
    featured: true
  }
];

async function seed() {
  try {
    console.log('Connecting...');
    await mongoose.connect(MONGODB_URI);
    await Product.deleteMany({});
    await Product.insertMany(INITIAL_MASTERPIECES);
    console.log('Boutique Archived.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
