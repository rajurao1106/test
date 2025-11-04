import 'dotenv/config'; // Loads .env variables for ES Modules
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Note: We import 'authRoutes' using 'import' and ensure the '.js' extension is present.
import authRoutes from './routes/auth.js'; 

const app = express(); 
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows client on port 3000 to talk to server on port 5000
app.use(express.json()); // Body parser

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

// Simple health check route
app.get('/', (req, res) => {
    res.send('Auth Server is running.');
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
