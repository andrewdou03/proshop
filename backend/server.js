import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file
import connectDB from './config/db.js'; // Importing the database connection
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import cookieParser from 'cookie-parser'; // Importing cookie parser
import orderRoutes from './routes/orderRoutes.js'; // Importing order routes
import uploadRoutes from './routes/uploadRoutes.js'; // Importing upload routes

const port = process.env.PORT || 8000;

connectDB();

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(cookieParser()); // Middleware to parse cookies


app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes); // Using order routes
app.use('/api/upload', uploadRoutes); // Using upload routes

app.get('/api/config/paypal', (req, res) => {
	res.send({clientId: process.env.PAYPAL_CLIENT_ID}); // Send PayPal client ID from environment variables
});
const __dirname = path.resolve(); 
 // Get the current directory path
app.use('/uploads', express.static(path.join(__dirname, '/uploads'))); // Serve static files from the uploads directory

// Resolve the current directory path for static files
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '/frontend/build')));

	app.get('/{*splat}', (req, res) => {
		res.sendFile(path.join(__dirname, '/frontend/build/index.html'));
	});
} else {
	app.get('/', (req, res) => {
		res.send('API is running...');
	});
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
