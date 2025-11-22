require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const aiRoutes = require('./routes/ai');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Social Media Business Trainer API (Instagram & Facebook)',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
      },
      user: {
        getProfile: 'GET /api/user/me (Protected)',
        updateProgress: 'PUT /api/user/progress (Protected)',
        updateProfile: 'PUT /api/user/update (Protected)',
      },
      ai: {
        chat: 'POST /api/ai/chat (Protected) - Chat with Coach Digital Sabah',
        generateBio: 'POST /api/ai/generate-bio (Protected)',
        analyzeImage: 'POST /api/ai/analyze-image (Protected)',
        chatCoach: 'POST /api/ai/chat-coach (Protected)',
        generateHashtags: 'POST /api/ai/generate-hashtags (Protected)',
      },
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

// Export for Vercel
module.exports = app;

// Start server if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
