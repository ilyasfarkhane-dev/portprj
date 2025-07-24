const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth');
const heroRoutes = require('./routes/hero');
const histoireRoutes = require('./routes/histoire');
const mapRoutes = require('./routes/map');
const mediaRoutes = require('./routes/media');
const multimediaRoutes = require('./routes/multimedia');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/auth', authRoutes);
app.use('/hero', heroRoutes);
app.use('/histoire', histoireRoutes);
app.use('/map', mapRoutes);
app.use('/medias', mediaRoutes);
app.use('/multimedia', multimediaRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 