import { fetchWeatherApi } from "openmeteo";

interface Coordinates {
    lat: number;
    lon: number;
}

type TempUnit = "celsius" | "fahrenheit";

interface GetWeatherDataProps {
    unit: string;
    coordinates: Coordinates | null;
}

interface WeatherData {
    current: {
        time: Date[];
        temperature_2m: number[];
        relative_humidity_2m: number[];
        apparent_temperature: number[];
        wind_speed_10m: number[];
        precipitation: number[];
    };
    hourly: {
        time: Date[];
        temperature_2m: number[];
        relative_humidity_2m: number[];
        apparent_temperature: number[];
        wind_speed_10m: number[];
        precipitation_probability: number[];
        precipitation: number[];
    };
    daily: {
        time: Date[];
        temperature_2m_max: number[];
        precipitation_probability_max: number[];
        uv_index_max: number[];
        precipitation_hours: number[];
    };
}

async function getWeatherData({
    unit,
    coordinates,
}: GetWeatherDataProps): Promise<WeatherData | null> {
    if (!coordinates) {
        return null;
    }

    const params = {
        latitude: coordinates.lat,
        longitude: coordinates.lon,
        temperature_unit: unit,
        daily: ["temperature_2m_max", "precipitation_probability_max", "uv_index_max", "precipitation_hours"],
        hourly: ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "wind_speed_10m", "precipitation_probability", "precipitation"],
        current: ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "precipitation", "wind_speed_10m"],
        timezone: "Asia/Singapore",
    };

    try {
        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);
        const response = responses[0];

        const current = response.current();
        const hourly = response.hourly();
        const daily = response.daily();
        const utcOffsetSeconds = response.utcOffsetSeconds();

        if (!hourly || !daily) {
            throw new Error("Missing hourly or daily data in response");
        }

        const hourlyTimes = Array.from(
            { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
            (_, i) =>
                new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
        );
        const dailyTimes = Array.from(
            { length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() },
            (_, i) =>
                new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
        );

        const weatherData: WeatherData = {
            current: {
                time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                temperature_2m: current.variables(0)!.value(),
                relative_humidity_2m: current.variables(1)!.value(),
                apparent_temperature: current.variables(2)!.value(),
                precipitation: current.variables(3)!.value(),
                wind_speed_10m: current.variables(4)!.value(),
            },
            hourly: {
                time: hourlyTimes,
                temperature_2m: hourly.variables(0)!.valuesArray(),
                relative_humidity_2m: hourly.variables(1)!.valuesArray(),
                apparent_temperature: hourly.variables(2)!.valuesArray(),
                wind_speed_10m: hourly.variables(3)!.valuesArray(),
                precipitation_probability: hourly.variables(4)!.valuesArray(),
                precipitation: hourly.variables(5)!.valuesArray(),
            },
            daily: {
                time: dailyTimes,
                temperature_2m_max: daily.variables(0)!.valuesArray(),
                precipitation_probability_max: daily.variables(1)!.valuesArray(),
                uv_index_max: daily.variables(2)!.valuesArray(),
                precipitation_hours: daily.variables(3)!.valuesArray(),
            },
        };

        return weatherData;
    } catch (error: any) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
}

export default getWeatherData;
