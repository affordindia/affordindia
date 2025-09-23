// Script to fix order status from 'in transit' to 'in-transit' in the database
import "../load-env.js"; // Load .env
import mongoose from "mongoose";
import Order from "../models/order.model.js";

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || "mongodb://localhost:27017/affordindia";

async function fixOrderStatus() {
  await mongoose.connect(MONGODB_URI);
  const result = await Order.updateMany(
    { status: "in transit" },
    { $set: { status: "in-transit" } }
  );
  console.log(`Updated ${result.nModified || result.modifiedCount} orders from 'in transit' to 'in-transit'.`);
  await mongoose.disconnect();
}

fixOrderStatus().catch(err => {
  console.error("Error updating order statuses:", err);
  process.exit(1);
});