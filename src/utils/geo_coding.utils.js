import axios from "axios";
import { ApiError } from "./apiError.utils.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getLatandLon = async (city, state, country) => {
    const query = [city, country]
        .filter((field) => field)
        .join(" ");

    try {
        const response = await axios.get(
            `https://geocode.maps.co/search?q=${encodeURIComponent(query)}&api_key=${process.env.GEOCODING_API}`
        );
        if (response.status === 200 && response.data.length > 0) {
            const resData = response.data[0];
            return { lat: parseFloat(resData.lat), lon: parseFloat(resData.lon) };
        }
        console.log(`No data found for city: ${city}`);
        return null;
    } catch (error) {
        console.error(`Error fetching coordinates for ${city}:`, error.message);
        return null;
    }
};

export const getDistanceBetween = async (origin, destination, city, country) => {
    try {
        const originCode = await getLatandLon(origin);
        await sleep(1000); // Delay of 1 second to respect rate limits
        const destinationCode = await getLatandLon(destination);

        if (!originCode) {
            throw new Error(`Could not fetch coordinates for origin: ${origin}`);
        }
        if (!destinationCode) {
            throw new Error(`Could not fetch coordinates for destination: ${destination}`);
        }

        console.log(originCode, destinationCode);
        const response = await axios.get(
            `https://distance-calculator8.p.rapidapi.com/calc?startLatitude=${originCode.lat}&startLongitude=${originCode.lon}&endLatitude=${destinationCode.lat}&endLongitude=${destinationCode.lon}`,
            {
                headers: {
                    "x-rapidapi-key": process.env.DISTANCE_API,
                    "x-rapidapi-host": "distance-calculator8.p.rapidapi.com",
                },
            }
        );

        if (response.status === 200 && response.data?.body?.distance?.kilometers) {
            return response.data.body.distance.kilometers;
        }
        console.log("Distance data missing in response");
        return null;
    } catch (error) {
        console.error(`Error calculating distance:`, error.message);
        return null;
    }
};