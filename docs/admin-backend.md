# AffordIndia Admin Backend API Documentation

## Overview

This documentation covers the RESTful API endpoints for the AffordIndia admin backend, built with Node.js, Express, MongoDB, and Cloudinary. It is intended for developers integrating with or maintaining the admin backend.

---

## Contents

-   [Authentication](#authentication)
-   [Product Management](#product-management)
-   [Category Management](#category-management)
-   [Order Management](#order-management)
-   [User Management](#user-management)
-   [Error Handling](#error-handling)
-   [Notes](#notes)

---

## Authentication

All admin endpoints (except login) require authentication via JWT. Obtain a token by logging in with admin credentials.

### 1. Admin Login

**POST** `/api/auth/login`

-   **Description:** Authenticate as admin and receive a JWT token.
-   **Body Parameters:**
    -   `username` (string, required)
    -   `password` (string, required)
-   **Request Example:**

```
{
  "username": "admin",
  "password": "yourpassword"
}
```

-   **Response Example:**

```
{
  "token": "<jwt_token>"
}
```

-   **Usage:**
    -   Pass the token in the `Authorization` header for all protected endpoints:
        ```
        Authorization: Bearer <jwt_token>
        ```

---

## Product Management

### Product Object Fields

A product object may include:

-   `_id`: string (auto-generated)
-   `name`: string (required)
-   `description`: string
-   `price`: number (required)
-   `images`: string[] (Cloudinary URLs)
-   `category`: string (category ID)
-   `brand`: string
-   `stock`: number
-   `ratings`: number (auto-calculated average)
-   `reviews`: string[] (review IDs)
-   `isFeatured`: boolean
-   `views`: number
-   `salesCount`: number
-   `createdAt`, `updatedAt`: ISO date strings

---

### 1. Create Product

**POST** `/api/products`

-   **Description:** Create a new product. Supports image upload (multipart/form-data).
-   **Body Parameters:**
    -   `name` (string, required)
    -   `description` (string, required)
    -   `price` (number, required)
    -   `category` (string, category ID, required)
    -   `stock` (number, required)
    -   `isFeatured` (boolean, optional)
    -   `images` (file[], optional, via multipart/form-data)
-   **Request Example (JSON):**

```
{
  "name": "Sample Product",
  "description": "A great product",
  "price": 199.99,
  "category": "60f7c2b8e1b1a2a3b4c5d6e7",
  "stock": 100,
  "isFeatured": true
}
```

-   **Response Example:**

```
{
  "_id": "...",
  "name": "Sample Product",
  "description": "A great product",
  "price": 199.99,
  "category": { ... },
  "stock": 100,
  "isFeatured": true,
  "images": ["https://..."],
  ...
}
```

---

### 2. Get All Products

**GET** `/api/products`

-   **Description:** Retrieve a list of products with support for search, filter, sort, and pagination via query parameters.
-   **Query Parameters:**
    -   `search` (string, optional) — Search by product name
    -   `category` (string, optional) — Filter by category ID
    -   `minPrice` (number, optional) — Minimum price
    -   `maxPrice` (number, optional) — Maximum price
    -   `isFeatured` (boolean, optional)
    -   `skip` (number, optional) — Pagination offset (default: 0)
    -   `limit` (number, optional) — Pagination limit (default: 20)
    -   `sort` (stringified JSON, optional) — e.g. `{ "price": -1 }` for descending price
-   **Request Example:**

```
GET /api/products?search=phone&minPrice=100&maxPrice=1000&limit=10&sort={"price":-1}
```

-   **Response Example:**

```
[
  {
    "_id": "...",
    "name": "Phone",
    "price": 499.99,
    ...
  },
  ...
]
```

---

### 3. Get Product by ID

**GET** `/api/products/:id`

-   **Description:** Retrieve a single product by its ID.
-   **Response Example:**

```
{
  "_id": "...",
  "name": "Sample Product",
  ...
}
```

---

### 4. Update Product

**PUT** `/api/products/:id`

-   **Description:** Update product details. Supports image upload (multipart/form-data).
-   **Body Parameters:** Same as create. Only include fields to update.
-   **Response Example:**

```
{
  "_id": "...",
  "name": "Updated Product",
  ...
}
```

---

### 5. Delete Product

**DELETE** `/api/products/:id`

-   **Description:** Permanently delete a product.
-   **Response Example:**

```
{
  "message": "Product deleted"
}
```

---

### 6. Remove Product Image

**DELETE** `/api/products/:id/images`

-   **Description:** Remove a specific image from a product.
-   **Body Parameters:**
    -   `imageUrl` (string, required)
-   **Request Example:**

```
{
  "imageUrl": "https://..."
}
```

-   **Response Example:**

```
{
  "_id": "...",
  "images": [ ... ]
}
```

---

### 7. Update Product Stock

**PATCH** `/api/products/:id/stock`

-   **Description:** Update the stock quantity for a product.
-   **Body Parameters:**
    -   `stock` (number, required)
-   **Request Example:**

```
{
  "stock": 50
}
```

-   **Response Example:**

```
{
  "_id": "...",
  "stock": 50,
  ...
}
```

---

### 8. Feature/Unfeature Product

**PATCH** `/api/products/:id/feature`

-   **Description:** Set the `isFeatured` status for a product.
-   **Body Parameters:**
    -   `isFeatured` (boolean, required)
-   **Request Example:**

```
{
  "isFeatured": true
}
```

-   **Response Example:**

```
{
  "_id": "...",
  "isFeatured": true,
  ...
}
```

---

### 9. Add Product Review

**POST** `/api/products/:id/reviews`

-   **Description:** Add a review to a product.
-   **Body Parameters:**
    -   `user` (string, user ID, required)
    -   `rating` (number, required)
    -   `comment` (string, optional)
-   **Request Example:**

```
{
  "user": "60f7c2b8e1b1a2a3b4c5d6e7",
  "rating": 5,
  "comment": "Great product!"
}
```

-   **Response Example:**

```
{
  "_id": "...",
  "user": "...",
  "rating": 5,
  "comment": "Great product!",
  ...
}
```

---

### 10. Get Product Reviews

**GET** `/api/products/:id/reviews`

-   **Description:** Get all reviews for a product.
-   **Response Example:**

```
[
  {
    "_id": "...",
    "user": { ... },
    "rating": 5,
    "comment": "Great product!",
    ...
  },
  ...
]
```

---

### 11. Delete Product Review

**DELETE** `/api/products/:id/reviews/:reviewId`

-   **Description:** Delete a review from a product.
-   **Response Example:**

```
{
  "_id": "...",
  "reviews": [ ... ]
}
```

---

### 12. Product Analytics

**GET** `/api/products/:id/analytics`

-   **Description:** Get analytics for a product (views, sales count, ratings, reviews count).
-   **Response Example:**

```
{
  "views": 123,
  "salesCount": 10,
  "ratings": 4.5,
  "reviewsCount": 8
}
```

---

## Category Management

### Category Object Fields

A category object may include:

-   `_id`: string (auto-generated)
-   `name`: string (required, unique)
-   `description`: string
-   `image`: string (Cloudinary URL)
-   `parentCategory`: string (category ID, optional)
-   `status`: string ("active" or "inactive")
-   `order`: number (for sibling display order)
-   `createdAt`, `updatedAt`: ISO date strings

---

### 1. Create Category

**POST** `/api/categories`

-   **Description:** Create a new category. Supports image upload (multipart/form-data).
-   **Body Parameters:**
    -   `name` (string, required, unique)
    -   `description` (string, optional)
    -   `image` (file, optional, via multipart/form-data)
    -   `parentCategory` (string, optional)
    -   `order` (number, optional)
-   **Request Example (JSON):**

```
{
  "name": "Electronics",
  "description": "All electronic items",
  "parentCategory": null,
  "order": 1
}
```

-   **Response Example:**

```
{
  "_id": "...",
  "name": "Electronics",
  "description": "All electronic items",
  "image": "https://...",
  "parentCategory": null,
  "status": "active",
  "order": 1,
  ...
}
```

---

### 2. Get All Categories

**GET** `/api/categories`

-   **Description:** Retrieve a list of categories with support for search, filter, and pagination via query parameters.
-   **Query Parameters:**
    -   `status` (string, optional) — Filter by status ("active"/"inactive")
    -   `parentCategory` (string, optional) — Filter by parent category ID
    -   `search` (string, optional) — Search by category name
    -   `skip` (number, optional) — Pagination offset (default: 0)
    -   `limit` (number, optional) — Pagination limit (default: 100)
-   **Request Example:**

```
GET /api/categories?status=active&search=electronics&limit=10
```

-   **Response Example:**

```
[
  {
    "_id": "...",
    "name": "Electronics",
    ...
  },
  ...
]
```

---

### 3. Get Category by ID

**GET** `/api/categories/:id`

-   **Description:** Retrieve a single category by its ID.
-   **Response Example:**

```
{
  "_id": "...",
  "name": "Electronics",
  ...
}
```

---

### 4. Update Category

**PUT** `/api/categories/:id`

-   **Description:** Update category details. Supports image upload (multipart/form-data).
-   **Body Parameters:** Same as create. Only include fields to update.
-   **Response Example:**

```
{
  "_id": "...",
  "name": "Updated Category",
  ...
}
```

---

### 5. Disable (Soft Delete) Category

**PATCH** `/api/categories/:id/disable`

-   **Description:** Disable (soft delete) a category by setting its status to "inactive".
-   **Response Example:**

```
{
  "message": "Category disabled (status set to inactive)"
}
```

---

### 6. Restore Category

**PATCH** `/api/categories/:id/restore`

-   **Description:** Restore a previously disabled category by setting its status to "active".
-   **Response Example:**

```
{
  "message": "Category restored",
  "category": { ... }
}
```

---

### 7. Permanently Delete Category

**DELETE** `/api/categories/:id/permanent`

-   **Description:** Permanently delete a category from the database.
-   **Response Example:**

```
{
  "message": "Category permanently deleted"
}
```

---

## Order Management

### Order Object Fields

An order object may include:

-   `_id`: string (auto-generated)
-   `user`: string (user ID)
-   `items`: array of objects (each with `product`, `quantity`, `price`)
-   `shippingAddress`: object (houseNumber, street, landmark, area, city, state, pincode, country)
-   `paymentMethod`: string
-   `paymentStatus`: string ("pending", "paid", "failed")
-   `paymentInfo`: object (Razorpay/Stripe/etc. payment details)
-   `status`: string ("pending", "processing", "shipped", "delivered", "cancelled", "returned")
-   `subtotal`, `shippingFee`, `discount`, `total`: number
-   `trackingNumber`: string
-   `deliveredAt`, `cancelledAt`: ISO date strings
-   `coupon`: string (coupon ID, optional)
-   `notes`: string
-   `createdAt`, `updatedAt`: ISO date strings

---

### 1. Get All Orders

**GET** `/api/orders`

-   **Description:** Retrieve a list of orders with support for advanced filter, multi-value, date range, sort, and pagination via query parameters.
-   **Query Parameters:**
    -   `status` (string or array, optional) — Filter by one or more statuses (e.g., `status=pending&status=processing`)
    -   `paymentStatus` (string or array, optional) — Filter by one or more payment statuses
    -   `user` (string, optional) — Filter by user ID
    -   `coupon` (string, optional) — Filter by coupon ID
    -   `startDate` (string, optional, ISO) — Filter orders created after this date
    -   `endDate` (string, optional, ISO) — Filter orders created before this date
    -   `skip` (number, optional) — Pagination offset (default: 0)
    -   `limit` (number, optional) — Pagination limit (default: 40)
    -   `sort` (stringified JSON, optional) — e.g. `{ "createdAt": -1 }` for newest first
-   **Request Example:**

```
GET /api/orders?status=pending&status=processing&user=USER_ID&startDate=2025-06-01&endDate=2025-06-24&limit=20&sort={"createdAt":-1}
```

-   **Response Example:**

```
{
  "success": true,
  "orders": [
    {
      "_id": "...",
      "user": { ... },
      "items": [ ... ],
      ...
    },
    ...
  ],
  "total": 42
}
```

---

### 2. Get Order by ID

**GET** `/api/orders/:id`

-   **Description:** Retrieve a single order by its ID.
-   **Response Example:**

```
{
  "success": true,
  "order": {
    "_id": "...",
    ...
  }
}
```

---

### 3. Update Order

**PATCH** `/api/orders/:id`

-   **Description:** Update order details (status, tracking, etc.).
-   **Body Parameters:** Only include fields to update.
-   **Response Example:**

```
{
  "success": true,
  "order": {
    "_id": "...",
    ...
  }
}
```

---

### 4. Delete Order

**DELETE** `/api/orders/:id`

-   **Description:** Permanently delete an order.
-   **Response Example:**

```
{
  "success": true,
  "message": "Order deleted"
}
```

---

## User Management

### User Object Fields

A user object may include:

-   `_id`: string (auto-generated)
-   `name`: string (required)
-   `email`: string (required, unique)
-   `password`: string (hashed, not returned)
-   `address`: object (houseNumber, street, landmark, area, city, state, pincode, country)
-   `phone`: string
-   `isBlocked`: boolean
-   `orders`: array of order IDs
-   `wishlist`: array of product IDs
-   `createdAt`, `updatedAt`: ISO date strings

---

### 1. Get All Users

**GET** `/api/users`

-   **Description:** Retrieve a list of users with support for filter, pagination, and sorting via query parameters.
-   **Query Parameters:**
    -   `name` (string, optional) — Filter by name (partial match)
    -   `email` (string, optional) — Filter by email (partial match)
    -   `isBlocked` (boolean, optional)
    -   `page` (number, optional, default: 1)
    -   `limit` (number, optional, default: 20)
    -   `sort` (string, optional, default: "-createdAt")
-   **Request Example:**

```
GET /api/users?name=john&isBlocked=false&page=1&limit=10
```

-   **Response Example:**

```
{
  "users": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "isBlocked": false,
      ...
    },
    ...
  ],
  "total": 42,
  "page": 1,
  "limit": 10
}
```

---

### 2. Get User by ID

**GET** `/api/users/:id`

-   **Description:** Retrieve a single user by their ID.
-   **Response Example:**

```
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "isBlocked": false,
  ...
}
```

---

## Error Handling

All error responses follow this format:

```
{
  "message": "Error message",
  "error": "Detailed error (if available)"
}
```

---

## Notes

-   All endpoints require authentication unless otherwise specified.
-   Product, category, and order pagination defaults are separate and configurable in backend.
-   For image upload, use `multipart/form-data` with the `image` or `images` field.
-   For sorting, pass a stringified JSON object in the `sort` query param (e.g., `{"price":-1}`).
-   Disabling a category does not remove it from the database; use permanent delete to remove it completely.
-   For multi-value filters (e.g., status), pass the same query param multiple times: `status=pending&status=processing`.

---

_For further details or questions, contact the backend maintainer._
