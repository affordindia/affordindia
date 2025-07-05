# AffordIndia Client Backend API Documentation

## Overview

This documentation covers the RESTful API endpoints for the AffordIndia client (main-website) backend, built with Node.js, Express, and MongoDB. It is intended for developers integrating with or maintaining the client backend.

---

## Contents

-   [Product Management](#product-management)
-   [Review Management](#review-management)
-   [Error Handling](#error-handling)
-   [Notes](#notes)

---

## Product Management

### Product Object Fields

A product object may include:

-   `_id`: string (auto-generated)
-   `name`: string (required)
-   `description`: string
-   `price`: number (required)
-   `images`: string[]
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

### 1. List Products

**GET** `/api/products`

-   **Description:** Retrieve a list of products with support for search, filter, sort, and pagination via query parameters.
-   **Query Parameters:**
    -   `search` (string, optional) — Search by product name
    -   `category` (string, optional) — Filter by category ID
    -   `brand` (string, optional) — Filter by brand
    -   `minPrice` (number, optional) — Minimum price
    -   `maxPrice` (number, optional) — Maximum price
    -   `inStock` (boolean, optional) — Only show products in stock
    -   `limit` (number, optional) — Pagination limit (default: 20)
    -   `page` (number, optional) — Page number (default: 1)
    -   `sort` (string, optional) — e.g. `-createdAt`, `price`, etc.
-   **Request Example:**

```
GET /api/products?search=phone&minPrice=100&maxPrice=1000&limit=10&sort=price
```

-   **Response Example:**

```
{
  "page": 1,
  "limit": 10,
  "count": 2,
  "totalCount": 42,
  "products": [
    {
      "_id": "...",
      "name": "Phone",
      "price": 499.99,
      ...
    },
    ...
  ]
}
```

---

### 2. Get Product by ID

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

### 3. Get Featured Products

**GET** `/api/products/featured`

-   **Description:** Get a list of featured products.
-   **Query Parameters:**
    -   `limit` (number, optional, default: 20)
-   **Response Example:**

```
{
  "count": 3,
  "products": [ ... ]
}
```

---

### 4. Get New Products

**GET** `/api/products/new`

-   **Description:** Get a list of new products (added in the last X days, configurable).
-   **Query Parameters:**
    -   `limit` (number, optional, default: 20)
-   **Response Example:**

```
{
  "count": 5,
  "products": [ ... ]
}
```

---

### 5. Get Popular Products

**GET** `/api/products/popular`

-   **Description:** Get a list of popular products (by views or sales count, configurable).
-   **Query Parameters:**
    -   `limit` (number, optional, default: 20)
-   **Response Example:**

```
{
  "count": 4,
  "products": [ ... ]
}
```

---

### 6. Get Related Products

**GET** `/api/products/:id/related`

-   **Description:** Get a list of related products (same category, excluding current product).
-   **Query Parameters:**
    -   `limit` (number, optional, default: 8)
-   **Response Example:**

```
{
  "count": 3,
  "products": [ ... ]
}
```

---

## Review Management

### Review Object Fields

A review object may include:

-   `_id`: string (auto-generated)
-   `user`: object (user info, e.g. `{ _id, name }`)
-   `product`: string (product ID)
-   `rating`: number (1-5)
-   `comment`: string
-   `createdAt`, `updatedAt`: ISO date strings

---

### 1. Create Review for a Product

**POST** `/api/products/:productId/reviews`

-   **Description:** Add a review to a product. Only the logged-in user can create a review. One review per user per product.
-   **Body Parameters:**
    -   `rating` (number, required)
    -   `comment` (string, optional)
-   **Auth:** Required
-   **Request Example:**

```
{
  "rating": 5,
  "comment": "Great product!"
}
```

-   **Response Example:**

```
{
  "_id": "...",
  "user": { "_id": "...", "name": "John" },
  "rating": 5,
  "comment": "Great product!",
  ...
}
```

---

### 2. List Reviews for a Product

**GET** `/api/products/:productId/reviews`

-   **Description:** Get all reviews for a product.
-   **Response Example:**

```
{
  "count": 2,
  "reviews": [
    {
      "_id": "...",
      "user": { "_id": "...", "name": "John" },
      "rating": 5,
      "comment": "Great product!",
      ...
    },
    ...
  ]
}
```

---

### 3. Get a Single Review for a Product

**GET** `/api/products/:productId/reviews/:reviewId`

-   **Description:** Get a single review for a product by review ID.
-   **Response Example:**

```
{
  "_id": "...",
  "user": { "_id": "...", "name": "John" },
  "rating": 5,
  "comment": "Great product!",
  ...
}
```

---

### 4. Update a Review for a Product

**PUT** `/api/products/:productId/reviews/:reviewId`

-   **Description:** Update a review. Only the review owner can update their review.
-   **Body Parameters:**
    -   `rating` (number, required)
    -   `comment` (string, optional)
-   **Auth:** Required
-   **Response Example:**

```
{
  "_id": "...",
  "user": { "_id": "...", "name": "John" },
  "rating": 4,
  "comment": "Updated comment",
  ...
}
```

---

### 5. Delete a Review for a Product

**DELETE** `/api/products/:productId/reviews/:reviewId`

-   **Description:** Delete a review. Only the review owner can delete their review.
-   **Auth:** Required
-   **Response Example:**

```
{
  "success": true
}
```

---

## Error Handling

All error responses follow this format:

```
{
  "success": false,
  "message": "Error message",
  "stack": "..." // Only in development
}
```

---

## Notes

-   Some endpoints require authentication (see above). Use the `Authorization: Bearer <token>` header.
-   Pagination, product, and review limits are configurable in backend config.
-   Only the review owner can update or delete their review.
-   For advanced product filtering, use the appropriate query parameters.
-   For further details or questions, contact the backend maintainer.
