
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const documentRoutes = require('./routes/documentRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/documents', documentRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
.catch(err => {
    console.error('Database connection error:', err);
});
