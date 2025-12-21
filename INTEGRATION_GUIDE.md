# Frontend-Backend Integration Guide

## ✅ Completed Integration

### 1. API Service Layer
- Created `src/utils/api.js` with public and admin API functions
- Configured base URL and authentication headers
- All API calls are centralized and reusable

### 2. Authentication System
- Created `AuthContext` for admin authentication
- Admin login page (`/admin/login`)
- Protected routes for admin pages
- JWT token stored in localStorage

### 3. Data Hooks
- `useProducts` - Fetch products with filters
- `useProduct` - Fetch single product
- `useSchools` - Fetch schools

### 4. Updated Pages (Using Real API)
- ✅ Home page - Shows products and schools from API
- ✅ Uniforms page - Filters products from API
- ✅ ProductCard component - Updated for API data structure
- ⚠️ ProductDetail page - Partially updated (needs stock status handling)

### 5. New Pages Created
- ✅ Checkout page - Order placement with delivery/store pickup
- ✅ Order Confirmation page
- ✅ Corporate Inquiry page

### 6. Admin Portal
- ✅ Admin Login
- ✅ Admin Dashboard with statistics
- ✅ Admin Products Management (list, view, delete)
- ⚠️ Admin Orders page - Needs to be created
- ⚠️ Admin Schools page - Needs to be created
- ⚠️ Admin Inquiries page - Needs to be created
- ⚠️ Product Create/Edit forms - Needs to be created
- ⚠️ School Create/Edit forms - Needs to be created

## 🔧 Configuration Needed

### Environment Variables
Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:5000/api
```

## 📝 Still To Do

### High Priority
1. Complete ProductDetail page stock status integration
2. Update SchoolCollection page to use API
3. Update MensWear page to use API
4. Create Admin Orders page
5. Create Admin Schools page
6. Create Admin Inquiries page
7. Create Product Create/Edit forms
8. Create School Create/Edit forms
9. Add stock management UI in admin

### Medium Priority
1. Update CartContext to check stock availability
2. Add loading states to all pages
3. Add error handling UI
4. Add order tracking page

### Low Priority
1. Add image upload for products/schools
2. Add bulk operations in admin
3. Add export functionality
4. Add search filters

## 🚀 Running the Application

1. **Backend Server:**
   ```bash
   cd server
   npm install
   npm run dev
   ```
   Server runs on http://localhost:5000

2. **Frontend:**
   ```bash
   npm install
   npm run dev
   ```
   Frontend runs on http://localhost:5173

3. **Admin Login:**
   - URL: http://localhost:5173/admin/login
   - Email: admin@schoolapp.com
   - Password: admin123

## 📊 API Endpoints Used

### Public Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/schools` - Get all schools
- `GET /api/schools/:id` - Get single school
- `POST /api/orders` - Create order
- `POST /api/inquiries` - Create inquiry

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Get current admin
- `GET /api/products/admin/all` - Get all products (with stock)
- `DELETE /api/products/:id` - Delete product
- `GET /api/orders/admin/all` - Get all orders
- `GET /api/orders/admin/stats` - Get order statistics
- `GET /api/inquiries/admin/all` - Get all inquiries

## 🔐 Authentication Flow

1. Admin logs in via `/admin/login`
2. JWT token stored in localStorage as `adminToken`
3. All admin API calls include token in Authorization header
4. Protected routes check authentication status
5. Logout clears token and redirects to login

## 📦 Data Structure Notes

### Product API Response
```javascript
{
  _id: string,
  name: string,
  sku: string,
  price: number,
  originalPrice?: number,
  images: string[],
  sizes: string[],
  colors: string[],
  category: string,
  school: ObjectId | School Object,
  stockStatus: [{ size, color, inStock }],
  isOutOfStock: boolean
}
```

### School API Response
```javascript
{
  _id: string,
  name: string,
  slug: string,
  logo: string,
  color: string,
  category: string
}
```

## 🐛 Known Issues

1. ProductDetail page needs proper stock status checking
2. Cart doesn't validate stock before adding
3. Some pages still reference old mockData structure
4. Admin product/school forms not yet implemented

