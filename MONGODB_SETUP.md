# MongoDB Setup Guide

## Installation

MongoDB has been added to your Next.js project with the following packages:
- `mongodb` - Official MongoDB driver
- `mongoose` - MongoDB ODM (Object Data Modeling)

## Configuration

### Environment Variables

Add to your `.env` or `.env.local` file:

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/slcinnamon

# Or MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/slcinnamon?retryWrites=true&w=majority
```

## Project Structure

```
lib/
├── mongodb.js              # Database connection utility
└── models/
    ├── User.js             # User model
    ├── Product.js          # Product model
    └── Order.js            # Order model

app/api/
├── users/
│   ├── route.js            # GET, POST /api/users
│   └── [id]/
│       └── route.js        # GET, PUT, DELETE /api/users/:id
└── products/
    └── route.js            # GET, POST /api/products
```

## Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String,
  role: 'customer' | 'vendor' | 'admin',
  businessName: String,
  phone: String,
  address: Object,
  isActive: Boolean,
  profileImage: String,
  timestamps: true
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  category: 'sticks' | 'powder' | 'oil' | 'tea' | 'other',
  price: Number,
  unit: String,
  stock: Number,
  vendor: ObjectId (ref: User),
  images: [String],
  rating: { average: Number, count: Number },
  status: 'active' | 'pending' | 'inactive' | 'out-of-stock',
  origin: String,
  certifications: [String],
  featured: Boolean,
  timestamps: true
}
```

### Order Model
```javascript
{
  orderNumber: String (auto-generated),
  customer: ObjectId (ref: User),
  vendor: ObjectId (ref: User),
  items: [{ product, name, price, quantity, subtotal }],
  totalAmount: Number,
  shippingAddress: Object,
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded',
  paymentMethod: String,
  notes: String,
  timestamps: true
}
```

## API Routes

### Users

#### GET /api/users
Get all users (optionally filter by role)
```javascript
// Get all users
fetch('/api/users')

// Get only vendors
fetch('/api/users?role=vendor')
```

#### POST /api/users
Create a new user
```javascript
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'vendor',
    businessName: 'John\'s Cinnamon Shop'
  })
})
```

#### GET /api/users/[id]
Get a single user by ID
```javascript
fetch('/api/users/507f1f77bcf86cd799439011')
```

#### PUT /api/users/[id]
Update a user
```javascript
fetch('/api/users/507f1f77bcf86cd799439011', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Updated',
    phone: '+1234567890'
  })
})
```

#### DELETE /api/users/[id]
Delete a user
```javascript
fetch('/api/users/507f1f77bcf86cd799439011', {
  method: 'DELETE'
})
```

### Products

#### GET /api/products
Get all products with optional filters
```javascript
// Get all products
fetch('/api/products')

// Filter by vendor
fetch('/api/products?vendor=507f1f77bcf86cd799439011')

// Filter by category
fetch('/api/products?category=powder')

// Search products
fetch('/api/products?search=ceylon')
```

#### POST /api/products
Create a new product
```javascript
fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Premium Ceylon Cinnamon Sticks',
    description: 'Authentic Ceylon cinnamon from Sri Lanka',
    category: 'sticks',
    price: 25.99,
    unit: 'kg',
    stock: 100,
    vendor: '507f1f77bcf86cd799439011',
    origin: 'Sri Lanka',
    status: 'active'
  })
})
```

## Usage in Components

### Example: Fetch Users
```javascript
'use client'
import { useState, useEffect } from 'react'

export default function UsersList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users?role=vendor')
        const data = await res.json()
        if (data.success) {
          setUsers(data.data)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {users.map(user => (
        <div key={user._id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  )
}
```

### Example: Create Product
```javascript
async function createProduct(productData) {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    })
    
    const data = await res.json()
    
    if (data.success) {
      console.log('Product created:', data.data)
      return data.data
    } else {
      throw new Error(data.error)
    }
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}
```

## Running MongoDB Locally

### Install MongoDB
1. Download from https://www.mongodb.com/try/download/community
2. Install and start the service

### Or use Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Connect with MongoDB Compass
Download MongoDB Compass and connect to:
```
mongodb://localhost:27017
```

## Using MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Add your IP to whitelist (0.0.0.0/0 for development)
5. Create a database user
6. Get connection string and add to `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/slcinnamon?retryWrites=true&w=majority
```

## Testing the API

### Using Browser/Fetch
```javascript
// In browser console or component
fetch('/api/users')
  .then(res => res.json())
  .then(console.log)
```

### Using cURL
```bash
# Get all users
curl http://localhost:3001/api/users

# Create a user
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"customer"}'
```

### Using Postman or Thunder Client
Import the following endpoints:
- GET http://localhost:3001/api/users
- POST http://localhost:3001/api/users
- GET http://localhost:3001/api/users/:id
- PUT http://localhost:3001/api/users/:id
- DELETE http://localhost:3001/api/users/:id
- GET http://localhost:3001/api/products
- POST http://localhost:3001/api/products

## Best Practices

1. **Always use connection pooling**: The `lib/mongodb.js` utility handles this
2. **Use indexes**: Already configured in models for common queries
3. **Validate data**: Mongoose schemas provide validation
4. **Handle errors**: Always wrap database operations in try-catch
5. **Don't expose sensitive data**: Password field has `select: false`
6. **Use population**: Load related data with `.populate()`

## Next Steps

1. Add authentication API routes
2. Implement password hashing (bcrypt)
3. Add JWT tokens for authentication
4. Create more API routes for Orders
5. Add pagination and sorting to GET routes
6. Implement image upload for products
7. Add data validation middleware
8. Create database seed scripts

## Troubleshooting

### Connection Issues
- Check if MongoDB is running locally
- Verify MONGODB_URI in .env file
- Check firewall/network settings
- For Atlas: verify IP whitelist

### Model Not Found
- Make sure to import the model before using
- Check model export syntax

### Validation Errors
- Check schema requirements
- Verify data types match schema

---

MongoDB is now fully integrated into your Next.js application!
