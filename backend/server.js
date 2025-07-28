require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const businessRoutes = require('./routes/business.routes');
const applicationRoutes = require('./routes/application.routes');
const chatbotRoutes = require('./routes/chatbot.routes');
const schemesRoutes = require('./routes/schemes.routes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/schemes', schemesRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Delhi Ascent API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
