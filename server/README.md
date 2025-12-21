# School Uniform App - Backend Server

Node.js backend server with MongoDB for the School Uniform E-Commerce Platform.

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Copy the `env.template` file to `.env` and update with your credentials:

```bash
cp env.template .env
```

Edit `.env` and provide:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secret key for JWT tokens
- `FRONTEND_URL` - Frontend URL for CORS
- Other configuration as needed

### 3. MongoDB Connection

The server will connect to MongoDB using the `MONGODB_URI` from your `.env` file.

For local MongoDB:
```
MONGODB_URI=mongodb://localhost:27017/school-uniform-app
```

For MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school-uniform-app?retryWrites=true&w=majority
```

### 4. Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

### 5. Create First Admin User

After setting up MongoDB and starting the server, create your first admin user:

```bash
node scripts/createAdmin.js "Admin Name" admin@example.com password123 super-admin
```

This will create a super-admin account that can manage other admins.

## API Endpoints

### Public Endpoints

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

#### Schools
- `GET /api/schools` - Get all schools
- `GET /api/schools/:id` - Get single school

#### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderNumber` - Get order by order number

#### Inquiries
- `POST /api/inquiries` - Create corporate inquiry

### Admin Endpoints (Requires Authentication)

#### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/register` - Register new admin (Super Admin only)
- `GET /api/admin/me` - Get current admin

#### Products (Admin)
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/admin/all` - Get all products with stock info
- `PUT /api/products/admin/:id/stock` - Update product stock

#### Schools (Admin)
- `POST /api/schools` - Create school
- `PUT /api/schools/:id` - Update school
- `DELETE /api/schools/:id` - Delete school
- `GET /api/schools/admin/all` - Get all schools with stats

#### Orders (Admin)
- `GET /api/orders/admin/all` - Get all orders
- `PUT /api/orders/admin/:id` - Update order status
- `GET /api/orders/admin/stats` - Get order statistics

#### Inquiries (Admin)
- `GET /api/inquiries/admin/all` - Get all inquiries
- `GET /api/inquiries/admin/:id` - Get single inquiry
- `PUT /api/inquiries/admin/:id` - Update inquiry status
- `GET /api/inquiries/admin/stats` - Get inquiry statistics

## Authentication

Admin endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Features

- ✅ Product management with stock tracking per size/color
- ✅ School/Institution management
- ✅ Order management with automatic stock reduction
- ✅ Low stock alerts (configurable threshold)
- ✅ Corporate inquiry system
- ✅ Admin authentication and authorization
- ✅ Out-of-stock automatic detection
- ✅ Delivery and store pickup options

## Stock Management

- Stock is tracked per product size and color
- Products are automatically marked as out-of-stock when all sizes/colors have 0 quantity
- Low stock alerts are triggered when stock falls below the threshold (default: 5)
- Stock is automatically reduced when orders are created

## Notes

- All product stock quantities are hidden from public endpoints
- Only stock availability (in-stock/out-of-stock) is shown to public users
- Admin endpoints show full stock information including quantities

