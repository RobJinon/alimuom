import { fetchWeatherApi } from "openmeteo";
import { useEffect, useState } from "react";

import CurrentWeatherCard from "./CurrentWeatherCard";
import CurrentWeatherDetailCard from "./CurrentWeatherDetailCard";
import DailyForecastCard from "./DailyForecastCard";

import getWeatherData from "./getWeatherData";

interface WeatherDetailsProps {
    city:string;
    unit:string;
    coordinates:{ lat:number; lon:number } | null;
}

interface DailyWeather {
    time: Date[];
    temperature_2m_max: number[];
    precipitation_probability_max: number[];
    uv_index_max: number[];
    precipitation_hours: number[];
}

function WeatherDetails( {city, unit, coordinates}: WeatherDetailsProps ) {
    let unitSymbol = unit === 'celsius' ? 'C' : 'F';
    const [currentTemp, setCurrentTemp] = useState<number | null>(null);
    const [currentApparentTemp, setCurrentApparentTemp] = useState<number | null>(null);
    const [relativeHumidity, setRelativeHumidity] = useState<number | null>(null);
    const [windSpeed, setWindSpeed] = useState<number | null>(null);
    const [precipitation, setPrecipitation] = useState<number | null>(null);
    const [dailyForecast, setDailyForecast] = useState<DailyWeather | null | undefined>(null);

    const currentDate = new Date();

    const dateOptions = { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long',
        day: 'numeric' 
    };

    const formattedDate = currentDate.toLocaleDateString('en-US', dateOptions);

    useEffect(()=>{
        if(!coordinates) return;

        const fetch = async () => {
            const data = await getWeatherData({ unit, coordinates});
            console.log("Weather data: ", data);

            setCurrentTemp(Math.round(data?.current.temperature_2m * 10)/10)
            setCurrentApparentTemp(Math.round(data?.current.apparent_temperature * 10)/10)
            setRelativeHumidity(data?.current.relative_humidity_2m)
            setWindSpeed(Math.round(data?.current.wind_speed_10m * 10)/10)
            setPrecipitation(Math.round(data?.current.precipitation * 10)/10)

            setDailyForecast(data?.daily);

        }

        fetch();

    }, [unit, coordinates]);

    useEffect(()=>{
        dailyForecast?.time.forEach((date, index) => {
            console.log(
                `Date: ${date.toDateString()}, \n` +
                `Max Temp: ${dailyForecast.temperature_2m_max[index]}°, \n` +
                `Precip Prob: ${dailyForecast.precipitation_probability_max[index]}%, \n` +
                `UV Index: ${dailyForecast.uv_index_max[index]}, \n` +
                `Precip Hours: ${dailyForecast.precipitation_hours[index]}`
            );
        });
    }, [dailyForecast])


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
                    <CurrentWeatherDetailCard 
                        title='Feels Like' 
                        content={( currentApparentTemp ? currentApparentTemp : '' )} 
                        unit='°C'
                    />
                    <CurrentWeatherDetailCard 
                        title='Humidity' 
                        content={( relativeHumidity ? relativeHumidity : '' )}
                        unit='%'
                    />
                    <CurrentWeatherDetailCard 
                        title='Wind' 
                        content={( windSpeed ? windSpeed : '' )}
                        unit=' km/h'
                    />
                    <CurrentWeatherDetailCard 
                        title='Precipitation' 
                        content={( precipitation != null ? precipitation : '' )}
                        unit=' mm'
                    />
                </div>

                <div className="grid grid-cols-3 lg:grid-cols-7 gap-4 w-full">
                    {dailyForecast?.time.map((date, index) => (
                        <DailyForecastCard
                            key={index}
                            day={date}
                            temperature={dailyForecast.temperature_2m_max[index]}
                            precipitation_probability={dailyForecast.precipitation_probability_max[index]}
                            uv_index={dailyForecast.uv_index_max[index]}
                        />
                    ))}
                </div>

            </div>
        </div>
     );
}

export default WeatherDetails;