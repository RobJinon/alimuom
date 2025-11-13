import { fetchWeatherApi } from "openmeteo";
import { useEffect, useState } from "react";

import CurrentWeatherCard from "./CurrentWeatherCard";
import CurrentWeatherDetailCard from "./CurrentWeatherDetailCard";

interface WeatherDetailsProps {
    city:string;
    unit:string;
    coordinates:{ lat:number; lon:number } | null;
}

function WeatherDetails( {city, unit, coordinates}: WeatherDetailsProps ) {
    let unitSymbol = unit === 'celsius' ? 'C' : 'F';
    const [currentTemp, setCurrentTemp] = useState<number | null>(null);
    const [currentApparentTemp, setCurrentApparentTemp] = useState<number | null>(null);
    const [relativeHumidity, setRelativeHumidity] = useState<number | null>(null);
    const [windSpeed, setWindSpeed] = useState<number | null>(null);
    const [precipitation, setPrecipitation] = useState<number | null>(null);

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedApiDate = `${year}-${month}-${day}`;

    const dateOptions = { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long',
        day: 'numeric' 
    };

    const formattedDate = currentDate.toLocaleDateString('en-US', dateOptions);
    
    useEffect(() => {
        console.log('City entered!');
        if (!coordinates) return;

        const fetchWeather = async () => {
            const params = {
                latitude: coordinates.lat,
                longitude: coordinates.lon,
                start_date: formattedApiDate,
                end_date: formattedApiDate,
                hourly: ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "wind_speed_10m", "precipitation"],
                timezone: 'Asia/Singapore',
                temperature_unit: unit,
            };

            const url = 'https://archive-api.open-meteo.com/v1/archive';
            const responses = await fetchWeatherApi(url, params);
            const response = responses[0];

            const hourly = response.hourly()!;
            const utcOffsetSeconds = response.utcOffsetSeconds();

            // Note: The order of weather variables in the URL query and the indices below need to match!
            const weatherData = {
                hourly: {
                    time: Array.from(
                        { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() }, 
                        (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
                    ),
                    temperature_2m: hourly.variables(0)!.valuesArray(),
                    relative_humidity_2m: hourly.variables(1)!.valuesArray(),
                    apparent_temperature: hourly.variables(2)!.valuesArray(),
                    wind_speed_10m: hourly.variables(3)!.valuesArray(),
                    precipitation: hourly.variables(4)!.valuesArray(),
                },
            };

            // The 'weatherData' object now contains a simple structure, with arrays of datetimes and weather information
            console.log("\nHourly data:\n", weatherData.hourly)

            const now = new Date();

            setCurrentTemp(Math.round(weatherData.hourly.temperature_2m[now.getHours()]));
            setCurrentApparentTemp(Math.round(weatherData.hourly.apparent_temperature[now.getHours()]));
            setRelativeHumidity(Math.round(weatherData.hourly.relative_humidity_2m[now.getHours()]));
            setWindSpeed(Math.round(weatherData.hourly.wind_speed_10m[now.getHours()]));
            setPrecipitation(Math.round(weatherData.hourly.precipitation[now.getHours()] * 10) / 10);
        };
        fetchWeather();

    }, [city, unit, coordinates]);

    useEffect(()=>{
        console.log('Current temperature:', currentTemp);
        console.log('Apparent temperature:', currentApparentTemp);
        console.log('Humidity: ', relativeHumidity);
        console.log('Precipitation: ', precipitation);
    }, [currentTemp, currentApparentTemp, relativeHumidity, precipitation]);



    return ( 
        <div className="flex sm:flex-col lg:flex-row my-3 p-5">
            <div className="flex flex-col w-full lg:w-2/3 gap-5">
                <div className="flex w-full">
                    <CurrentWeatherCard 
                        city={city}
                        currentTemp={currentTemp}
                        unitSymbol={unitSymbol}
                        formattedDate={formattedDate}
                        currentApparentTemp={currentApparentTemp}
                    />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    <CurrentWeatherDetailCard title='Feels Like' content={( currentApparentTemp ? currentApparentTemp : '' )+'°C'}/>
                    <CurrentWeatherDetailCard title='Humidity' content={( relativeHumidity ? relativeHumidity : '' )+'%'}/>
                    <CurrentWeatherDetailCard title='Wind' content={( windSpeed ? windSpeed : '' )+' km/h'}/>
                    <CurrentWeatherDetailCard title='Precipitation' content={( precipitation != null ? precipitation : '' )+' mm'}/>
                </div>
            </div>
        </div>
     );
}

export default WeatherDetails;