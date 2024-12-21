import { mongoose, Schema } from 'mongoose';


const PricingSchema = new Schema({
    Country: {
        type: String,
    },
    city: {
        type: String,
        required: true,
    },
    vehicleType: { type: String },
    airportFees: { type: Number },
    amountPerKM: { type: Number },
    amountPerHour: { type: Number },
    baseAmount: { type: Number },
    baseKM: { type: Number },
    isCityFlagged: { type: Boolean },
});

export const Pricing = mongoose.model("Pricing", PricingSchema);