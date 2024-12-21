import { Pricing } from "../models/price.models.js";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { getDistanceBetween } from './../utils/geo_coding.utils.js';


export const checkPricingController = asyncHandler(async (req, res) => {
    // res.send("Test pricing");
    const { origin, destination, city, vehicleType } = req.body;

    if (!origin || !destination || !city) {
        throw new ApiError(400, "origin, destination, city all fields required");
    }

    try {
        const cityData = await Pricing.find({
            "$and": [
                { "city": city },
                { vehicleType }
            ]
        });
        console.log(cityData);

        if (!cityData) {
            throw new ApiError(404, "City not found in the database");
        }

        const distance = await getDistanceBetween(origin, destination, city, cityData?.Country);
        console.log("Distance: ", distance);

        if (distance > 1000) {
            return res.status(200).json(new ApiResponse(200, "Too far to offer ride"));
        }

        let emailNeeded = false;
        let rideAmount = cityData.amountPerKM * distance;
        console.log("rideAmount: ", rideAmount);
        if (distance > 30 || rideAmount < 50 || !cityData.isCityFlagged) {
            emailNeeded = true;
        }

        return res.status(200).json({ emailNeeded });
    } catch (error) {
        console.error(error?.message);
        throw new ApiError(500, "Internal server error");
    }
});