import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(['/api/products', '/products'], productRoutes);
app.use(['/api/users', '/users'], authRoutes);
app.use(['/api/orders', '/orders'], orderRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Seeding function
const seedDatabase = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('No products found. Seeding default data...');

      // Clear users & products
      await User.deleteMany();
      await Product.deleteMany();

      // Create default users
      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        isAdmin: true,
      });

      await User.create({
        name: 'John Doe',
        email: 'user@example.com',
        password: 'user123',
        isAdmin: false,
      });

      console.log('Seeded Users: admin@example.com / admin123 and user@example.com / user123');

      // Create default products
      const defaultProducts = [
        {
          name: 'iPhone 15 Pro Max',
          image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80',
          description: 'Experience the ultimate iPhone with titanium design, the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
          brand: 'Apple',
          category: 'Phones',
          price: 1199,
          countInStock: 10,
          rating: 4.8,
          numReviews: 24,
        },
        {
          name: 'Sony WH-1000XM5 Headphones',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
          description: 'Industry-leading noise-canceling wireless headphones with dual processors, 8 microphones, exceptional call quality, and up to 30 hours of battery life.',
          brand: 'Sony',
          category: 'Audio',
          price: 399,
          countInStock: 15,
          rating: 4.6,
          numReviews: 18,
        },
        {
          name: 'MacBook Pro 16" M3 Max',
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80',
          description: 'The ultimate professional laptop. Features the M3 Max chip with 16-core CPU, 40-core GPU, up to 128GB of unified memory, and a gorgeous Liquid Retina XDR display.',
          brand: 'Apple',
          category: 'Computers',
          price: 3499,
          countInStock: 5,
          rating: 4.9,
          numReviews: 12,
        },
        {
          name: 'iPad Pro 13" (M4)',
          image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80',
          description: 'Thinnest Apple product ever, featuring the breakthrough Ultra Retina XDR Tandem OLED display, outrageous performance of the M4 chip, and superfast wireless connectivity.',
          brand: 'Apple',
          category: 'Tablets',
          price: 1299,
          countInStock: 8,
          rating: 4.7,
          numReviews: 15,
        },
        {
          name: 'Samsung Galaxy S24 Ultra',
          image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=80',
          description: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility.',
          brand: 'Samsung',
          category: 'Phones',
          price: 1299,
          countInStock: 12,
          rating: 4.7,
          numReviews: 20,
        },
        {
          name: 'PlayStation 5 Slim Console',
          image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&auto=format&fit=crop&q=80',
          description: 'Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.',
          brand: 'Sony',
          category: 'Gaming',
          price: 499,
          countInStock: 7,
          rating: 4.5,
          numReviews: 32,
        },
        {
          name: 'Cyberpunk Mechanical Keyboard',
          image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=80',
          description: 'Wireless mechanical keyboard with hot-swappable tactile switches, dynamic RGB backlighting, custom keycaps, and durable aluminum construction.',
          brand: 'Keychron',
          category: 'Accessories',
          price: 149,
          countInStock: 25,
          rating: 4.4,
          numReviews: 9,
        },
        {
          name: 'Premium Fitness Smartwatch',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
          description: 'Advanced health tracker with AMOLED screen, ECG monitoring, sleep coach, built-in GPS, smart notifications, and up to 7 days of battery life.',
          brand: 'Garmin',
          category: 'Accessories',
          price: 299,
          countInStock: 20,
          rating: 4.5,
          numReviews: 14,
        },
      ];

      await Product.insertMany(defaultProducts);
      console.log('Seeded 8 default electronics products successfully.');
    }
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  await seedDatabase();
});

export default app;
