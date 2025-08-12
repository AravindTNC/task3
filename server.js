const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const { logger, requestTime } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(logger);
app.use(requestTime);

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Routes
app.use('/products', productsRouter);
app.use('/users', usersRouter);

// Error handler (last)
app.use(errorHandler);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error(err));

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
