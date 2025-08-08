# Stock Web - Universal Inventory Management System

A web-based inventory management system designed for use in various types of stores. This system includes features for inventory tracking, sales management, user permissions, reporting, and customer/supplier management.

## Features

- User authentication with role-based permissions
- Inventory management (add, edit, delete products)
- Sales system with transaction tracking
- Customer registration and management
- Supplier registration and management
- Comprehensive reporting dashboard
- Responsive web interface

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the database:
   ```bash
   node backend/database/init.js
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Access the application at `http://localhost:3001`

## Project Structure

```
stock-web/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── database/
│   └── server.js
├── frontend/
│   ├── css/
│   ├── js/
│   ├── assets/
│   └── index.html
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get authentication token
- `GET /api/auth/me` - Get current user information

### Inventory Management
- `GET /api/inventory/products` - Get all products
- `POST /api/inventory/products` - Create a new product
- `GET /api/inventory/products/:id` - Get a specific product
- `PUT /api/inventory/products/:id` - Update a specific product
- `DELETE /api/inventory/products/:id` - Delete a specific product
- `GET /api/inventory/products/search?name=:name` - Search products by name
- `GET /api/inventory/categories` - Get all categories
- `POST /api/inventory/categories` - Create a new category
- `PUT /api/inventory/categories/:id` - Update a specific category
- `DELETE /api/inventory/categories/:id` - Delete a specific category

### Sales Management
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create a new sale
- `GET /api/sales/:id` - Get a specific sale
- `DELETE /api/sales/:id` - Delete a specific sale

### Customer Management
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create a new customer
- `GET /api/customers/:id` - Get a specific customer
- `PUT /api/customers/:id` - Update a specific customer
- `DELETE /api/customers/:id` - Delete a specific customer
- `GET /api/customers/search?name=:name` - Search customers by name

### Supplier Management
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create a new supplier
- `GET /api/suppliers/:id` - Get a specific supplier
- `PUT /api/suppliers/:id` - Update a specific supplier
- `DELETE /api/suppliers/:id` - Delete a specific supplier
- `GET /api/suppliers/search?name=:name` - Search suppliers by name

### Reports
- `GET /api/reports/sales?start_date=:start&end_date=:end` - Get sales report
- `GET /api/reports/inventory` - Get inventory report
- `GET /api/reports/customers` - Get customer report
- `GET /api/reports/suppliers` - Get supplier report

## Usage Examples

### User Authentication
```bash
# Register a new user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"password123","role":"admin"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

### Inventory Management
```bash
# Create a product (requires authentication token)
curl -X POST http://localhost:3001/api/inventory/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{"name":"Laptop","description":"High-performance laptop","category_id":1,"price":999.99,"cost":799.99,"stock_quantity":10,"min_stock_level":2}'

# Get all products
curl -X GET http://localhost:3001/api/inventory/products \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### Sales Management
```bash
# Create a sale (requires authentication token)
curl -X POST http://localhost:3001/api/sales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{"customer_id":1,"user_id":1,"total_amount":999.99,"discount":0,"tax":89.99,"final_amount":1089.98,"payment_method":"Credit Card","notes":"Test sale","items":[{"product_id":1,"quantity":1,"unit_price":999.99,"total_price":999.99}]}'
```

## License

MIT