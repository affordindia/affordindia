# AffordIndia Admin Backend API Documentation

## Overview

This documentation covers the RESTful API endpoints for the AffordIndia admin backend, built with Node.js, Express, MongoDB, and Cloudinary. It is intended for developers integrating with or maintaining the admin backend.

---

## Contents

-   [Authentication](#authentication)
-   [Product Management](#product-management)
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
-   Pagination defaults: `skip = 0`, `limit = 20` (configurable in backend).
-   For image upload, use `multipart/form-data` with the `images` field.
-   For sorting, pass a stringified JSON object in the `sort` query param (e.g., `{"price":-1}`).

---

_For further details or questions, contact the backend maintainer._
