import axios from "axios";
import { ApiError } from "./apiError.utils.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getLatandLon = async (city) => {
    try {
        const response = await axios.get(
            `https://geocode.maps.co/search?q=${city}&api_key=${process.env.GEOCODING_API}`
        );
        if (response.status == 200) {
            let resData = response.data;
            // console.log("Data from geocoding API:",  resData);
            return { lat: resData[0].lat, lon: resData[0].lon };
        }
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getDistanceBetween = async (origin, destination) => {
    try {
        const originCode = await getLatandLon(origin);
        await sleep(1000); //Dleay of 1 sec because api deosnt allo more than 1 request per second
        const destinationCode = await getLatandLon(destination);

        if(!originCode || !destinationCode) {
            throw new ApiError(500, "Internal server error");
        }
        // console.log({ originCode, destinationCode });
        const response = await axios.get(
            `https://distance-calculator8.p.rapidapi.com/calc?startLatitude=${originCode.lat}&startLongitude=${originCode.lon}&endLatitude=${destinationCode.lat}&endLongitude=${destinationCode.lon}`,
            {
                headers: {
                    "x-rapidapi-key": process.env.DISTANCE_API,
                    "x-rapidapi-host": "distance-calculator8.p.rapidapi.com",
                },
            }
        );

        if (response.status == 200) {
            //   console.log(response.data);
            //   console.log(response.data.body.distance.kilometers);
            return response.data.body.distance.kilometers;
        }
        return null;
    } catch (error) {
        console.log(error?.message);
        return null;
    }
};