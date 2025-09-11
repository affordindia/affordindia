import mongoose from "mongoose";

const invoiceCounterSchema = new mongoose.Schema(
    {
        year: {
            type: Number,
            required: true,
            unique: true,
            index: true,
        },
        sequence: {
            type: Number,
            required: true,
            default: 0,
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Static method to get next sequence number for a year
invoiceCounterSchema.statics.getNextSequence = async function (year) {
    const currentYear = year || new Date().getFullYear();

    // Use findOneAndUpdate with upsert for atomic operation
    const counter = await this.findOneAndUpdate(
        { year: currentYear },
        {
            $inc: { sequence: 1 },
            $set: { lastUpdated: new Date() },
        },
        {
            new: true,
            upsert: true, // Create if doesn't exist
            setDefaultsOnInsert: true,
        }
    );

    return counter.sequence;
};

// Static method to get current sequence (without incrementing)
invoiceCounterSchema.statics.getCurrentSequence = async function (year) {
    const currentYear = year || new Date().getFullYear();
    const counter = await this.findOne({ year: currentYear });
    return counter ? counter.sequence : 0;
};

// Static method to reset sequence for a new year (admin function)
invoiceCounterSchema.statics.resetSequence = async function (year) {
    const targetYear = year || new Date().getFullYear();
    return this.findOneAndUpdate(
        { year: targetYear },
        {
            sequence: 0,
            lastUpdated: new Date(),
        },
        {
            new: true,
            upsert: true,
        }
    );
};

// Method to format sequence number with leading zeros
invoiceCounterSchema.methods.getFormattedSequence = function () {
    return this.sequence.toString().padStart(4, "0");
};

const InvoiceCounter = mongoose.model("InvoiceCounter", invoiceCounterSchema);
export default InvoiceCounter;
