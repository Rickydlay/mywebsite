const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const questionRoutes = require('./routes/questions');
const answerRoutes = require('./routes/answers');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/questions', questionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/answers', answerRoutes); // Fixed duplicate require
app.use('/api/profile', require('./routes/profile'));

app.get('/', (req, res) => res.send('Q&A Backend Running'));

app.listen(port, '0.0.0.0', () => { // Added '0.0.0.0' for Render
  console.log(`Server running on port ${port}`);
});