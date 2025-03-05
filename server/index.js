import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Customer from './models/Customer.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());  // Allow all origins in production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Validate MongoDB ObjectId middleware
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid customer ID format' });
  }
  next();
};

// Connect to MongoDB with more detailed error handling
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Root route with HTML response
app.get('/', (req, res) => {
  console.log('Received request for root route');
  res.send(`
    <h1>Family Directory API</h1>
    <p>Available endpoints:</p>
    <ul>
      <li>GET /api/customers - Get all customers</li>
      <li>POST /api/customers - Create a new customer</li>
      <li>PUT /api/customers/:id - Update a customer</li>
      <li>DELETE /api/customers/:id - Delete a customer</li>
    </ul>
  `);
});

// Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    console.log('Retrieved customers:', customers.length);
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Failed to fetch customers. Please try again.' });
  }
});

// Create a new customer
app.post('/api/customers', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const savedCustomer = await customer.save();
    console.log('Created new customer:', savedCustomer._id);
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid customer data provided.' });
    }
    res.status(500).json({ message: 'Failed to create customer. Please try again.' });
  }
});

// Update a customer
app.put('/api/customers/:id', validateObjectId, async (req, res) => {
  try {
    // First check if the customer exists
    const existingCustomer = await Customer.findById(req.params.id);
    if (!existingCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Validate update data
    const updateData = { ...req.body };
    delete updateData._id; // Prevent _id modification

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true,
        runValidators: true // Run mongoose validations on update
      }
    );

    console.log('Updated customer:', req.params.id);
    res.json(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid update data provided.' });
    }
    res.status(500).json({ message: 'Failed to update customer. Please try again.' });
  }
});

// Delete a customer
app.delete('/api/customers/:id', validateObjectId, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await Customer.findByIdAndDelete(req.params.id);
    console.log('Deleted customer:', req.params.id);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Failed to delete customer. Please try again.' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong! Please try again.' });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI ? 'is set' : 'is NOT set'}`);
}).on('error', (err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});