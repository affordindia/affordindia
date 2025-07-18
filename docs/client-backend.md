# AffordIndia Client Backend API Documentation

## Overview

This documentation covers the RESTful API endpoints for the AffordIndia client (main-website) backend, built with Node.js, Express, and MongoDB. It is intended for developers integrating with or maintaining the client backend.

---

## Contents

-   [Product Management](#product-management)
-   [Review Management](#review-management)
-   [Cart Management](#cart-management)
-   [Wishlist Management](#wishlist-management)
-   [Order Management](#order-management)
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

## Cart Management

### Cart Object Fields

-   `_id`: string (auto-generated)
-   `user`: string (user ID)
-   `items`: array of cart items
    -   Each item:
        -   `_id`: string
        -   `product`: string (product ID)
        -   `name`: string
        -   `images`: string[]
        -   `stock`: number
        -   `quantity`: number
        -   `priceAtAdd`: number (price when added)
        -   `currentPrice`: number (current product price)
-   `updatedAt`, `createdAt`: ISO date strings

---

### 1. Get User Cart

**GET** `/api/cart`

-   **Description:** Get the current user's cart with all items and current product details.
-   **Auth:** Required
-   **Response Example:**

```
{
  "_id": "...",
  "user": "...",
  "items": [
    {
      "_id": "...",
      "product": "...",
      "name": "Product Name",
      "images": ["..."],
      "stock": 10,
      "quantity": 2,
      "priceAtAdd": 99.99,
      "currentPrice": 109.99
    },
    ...
  ],
  "updatedAt": "...",
  "createdAt": "..."
}
```

---

### 2. Add or Update Cart Item

**POST** `/api/cart`

-   **Description:** Add a product to the cart or update its quantity.
-   **Auth:** Required
-   **Body Parameters:**
    -   `productId` (string, required)
    -   `quantity` (number, required, min: 1)
-   **Request Example:**

```
{
  "productId": "...",
  "quantity": 3
}
```

-   **Response:** Returns the updated cart (see above).

---

### 3. Remove Cart Item

**DELETE** `/api/cart/:itemId`

-   **Description:** Remove an item from the cart by its item ID.
-   **Auth:** Required
-   **Response:** Returns the updated cart.

---

### 4. Clear Cart

**DELETE** `/api/cart/clear`

-   **Description:** Remove all items from the cart.
-   **Auth:** Required
-   **Response:** Returns the updated (empty) cart.

---

### 5. Merge Guest Cart

**POST** `/api/cart/merge`

-   **Description:** Merge a guest cart (from localStorage) into the user's cart after login.
-   **Auth:** Required
-   **Body Parameters:**
    -   `items`: array of `{ product: string, quantity: number }`
-   **Response:** Returns the merged cart.

---

## Wishlist Management

### Wishlist Object Fields

-   `_id`: string (auto-generated)
-   `user`: string (user ID)
-   `items`: array of product objects (populated)
-   `createdAt`, `updatedAt`: ISO date strings

---

### 1. Get User Wishlist

**GET** `/api/wishlist`

-   **Description:** Get the current user's wishlist. Supports filters via query parameters.
-   **Auth:** Required
-   **Query Parameters:**
    -   `category` (string, optional)
    -   `brand` (string, optional)
    -   `minPrice` (number, optional)
    -   `maxPrice` (number, optional)
    -   `search` (string, optional)
-   **Response Example:**

```
{
  "_id": "...",
  "user": "...",
  "items": [
    {
      "_id": "...",
      "name": "Product Name",
      "category": "...",
      "brand": "...",
      "price": 99.99,
      ...
    },
    ...
  ],
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### 2. Add to Wishlist

**POST** `/api/wishlist`

-   **Description:** Add a product to the wishlist.
-   **Auth:** Required
-   **Body Parameters:**
    -   `productId` (string, required)
-   **Response:** Returns the updated wishlist.

---

### 3. Remove from Wishlist

**DELETE** `/api/wishlist/:productId`

-   **Description:** Remove a product from the wishlist.
-   **Auth:** Required
-   **Response:** Returns the updated wishlist.

---

### 4. Move to Cart

**POST** `/api/wishlist/:productId/move-to-cart`

-   **Description:** Add a product from the wishlist to the cart (quantity 1) and remove it from the wishlist.
-   **Auth:** Required
-   **Response:** Returns the updated wishlist.

---

## Order Management

### Order Object Fields

A user order object includes:

- `_id`: string (auto-generated)
- `user`: string (user ID)
- `items`: array of products, quantity, and price at order time
- `shippingAddress`: object (houseNumber, street, city, state, pincode, country, etc.)
- `paymentMethod`: string (e.g., 'COD', 'ONLINE')
- `paymentStatus`: string ('pending', 'paid', 'failed')
- `paymentInfo`: object (payment gateway info, if any)
- `status`: string ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')
- `subtotal`: number (total price of items)
- `shippingFee`: number
- `discount`: number
- `total`: number (final order total)
- `trackingNumber`: string (optional)
- `deliveredAt`: ISO date string (when delivered)
- `cancelledAt`: ISO date string (when cancelled)
- `returnedAt`: ISO date string (when returned)
- `coupon`: string (coupon ID, optional)
- `notes`: string (optional)
- `createdAt`, `updatedAt`: ISO date strings (auto)

---

### 1. Place Order

**POST** `/api/orders`

- **Description:** Place a new order using the current cart. Deducts stock and clears cart.
- **Body Parameters:**
    - `shippingAddress` (object, required)
    - `paymentMethod` (string, required)
    - `paymentInfo` (object, optional)
- **Auth:** Required
- **Response:** Returns the created order object.

---

### 2. Get User Orders

**GET** `/api/orders`

- **Description:** Get a list of the current user's orders (most recent first).
- **Auth:** Required
- **Response:** Array of order objects.

---

### 3. Get Order by ID

**GET** `/api/orders/:orderId`

- **Description:** Get details of a specific order (must belong to user).
- **Auth:** Required
- **Response:** Order object.

---

### 4. Cancel Order

**POST** `/api/orders/:orderId/cancel`

- **Description:** Cancel an order (if status is 'pending' or 'processing').
- **Auth:** Required
- **Response:** Updated order object (status = 'cancelled', `cancelledAt` set).

---

### 5. Return Order

**POST** `/api/orders/:orderId/return`

- **Description:** Return an order (if status is 'delivered').
- **Auth:** Required
- **Response:** Updated order object (status = 'returned', `returnedAt` set).

---

### Status & Timestamps
- `status` reflects the current state of the order.
- `deliveredAt`, `cancelledAt`, `returnedAt` are set when the order is delivered, cancelled, or returned, respectively.
- `createdAt` and `updatedAt` are set automatically by the database.

---

### Example Order Object

```json
{
  "_id": "...",
  "user": "...",
  "items": [
    { "product": "...", "quantity": 2, "price": 499 }
  ],
  "shippingAddress": { "city": "Delhi", ... },
  "paymentMethod": "COD",
  "paymentStatus": "pending",
  "status": "pending",
  "subtotal": 998,
  "shippingFee": 50,
  "discount": 0,
  "total": 1048,
  "deliveredAt": null,
  "cancelledAt": null,
  "returnedAt": null,
  "createdAt": "2025-07-09T12:00:00.000Z",
  "updatedAt": "2025-07-09T12:00:00.000Z"
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
