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

// Helper function to transform MongoDB document to frontend format
const transformCustomer = (customer) => {
  if (!customer) return null;
  const transformed = customer.toObject();
  transformed.id = transformed._id.toString();
  delete transformed._id;
  if (transformed.familyMembers) {
    transformed.familyMembers = transformed.familyMembers.map(member => ({
      ...member,
      id: member._id.toString(),
      _id: undefined
    }));
  }
  return transformed;
};

// Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    console.log('Retrieved customers:', customers.length);
    res.json(customers.map(transformCustomer));
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
    res.status(201).json(transformCustomer(savedCustomer));
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
    console.log('Received UPDATE request for customer ID:', req.params.id);
    console.log('Update data:', JSON.stringify(req.body, null, 2));

    // First check if the customer exists
    const existingCustomer = await Customer.findById(req.params.id);
    console.log('Existing customer:', existingCustomer ? 'Found' : 'Not found');
    
    if (!existingCustomer) {
      console.log('Customer not found for update:', req.params.id);
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Validate update data
    const updateData = { ...req.body };
    delete updateData.id; // Remove frontend id
    delete updateData._id; // Prevent _id modification
    console.log('Processed update data:', JSON.stringify(updateData, null, 2));

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true,
        runValidators: true // Run mongoose validations on update
      }
    );

    console.log('Update successful:', customer._id);
    res.json(transformCustomer(customer));
  } catch (error) {
    console.error('Error updating customer:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid update data provided.' });
    }
    res.status(500).json({ message: 'Failed to update customer. Please try again.' });
  }
});

// Delete a customer
app.delete('/api/customers/:id', validateObjectId, async (req, res) => {
  try {
    console.log('Received DELETE request for customer ID:', req.params.id);

    const customer = await Customer.findById(req.params.id);
    console.log('Customer to delete:', customer ? 'Found' : 'Not found');
    
    if (!customer) {
      console.log('Customer not found for deletion:', req.params.id);
      return res.status(404).json({ message: 'Customer not found' });
    }

    const result = await Customer.findByIdAndDelete(req.params.id);
    console.log('Delete operation result:', result ? 'Success' : 'Failed');
    
    if (!result) {
      throw new Error('Delete operation failed');
    }

    const deletedCustomer = transformCustomer(result);
    console.log('Successfully deleted customer:', deletedCustomer.id);
    res.json({ 
      message: 'Customer deleted successfully', 
      deletedId: deletedCustomer.id 
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
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