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
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/questions', questionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/answers', require('./routes/answers'));
app.use('/api/profile', require('./routes/profile'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});