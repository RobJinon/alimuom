import { fetchWeatherApi } from "openmeteo";
import { useEffect, useState } from "react";


interface CurrentWeatherCardProps {
    city:string;
    unit:string;
    coordinates:{ lat:number; lon:number } | null;
}

function CurrentWeatherCard({city, unit, coordinates}: CurrentWeatherCardProps) {
    let unitSymbol = unit === 'celsius' ? 'C' : 'F';
    const [currentTemp, setCurrentTemp] = useState<number | null>(null);
    const [currentApparentTemp, setCurrentApparentTemp] = useState<number | null>(null);

    const currentDate = new Date();
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
                start_date: '2025-11-11',
                end_date: '2025-11-11',
                hourly: ["temperature_2m", "apparent_temperature"],
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
                    apparent_temperature: hourly.variables(1)!.valuesArray(),
                },
            };

            // The 'weatherData' object now contains a simple structure, with arrays of datetimes and weather information
            console.log("\nHourly data:\n", weatherData.hourly)

            const now = new Date();

            setCurrentTemp(Math.round(weatherData.hourly.temperature_2m[now.getHours()]));
            setCurrentApparentTemp(Math.round(weatherData.hourly.apparent_temperature[now.getHours()]));
    
            console.log('Current temperature:', currentTemp);
            console.log('Apparent temperature:', currentApparentTemp);
        };
        fetchWeather();

    }, [city, unit, coordinates]);

    return ( 
        <div className="card card-xl bg-primary py-5 w-full">
            <div className="card-body">
                <div className="flex flex-row items-center w-full">
                    <div className="flex flex-col w-1/2">
                        <p className="text-3xl">{city ? city : 'City not selected'}</p>
                        <p className="text-sm">{formattedDate}</p>
                    </div>
                    <div className="flex flex-col w-1/2 items-end gap-2">
                        <p className="text-6xl text-end w-1/2">{currentTemp}°{unitSymbol}</p>
                        <p className="text-sm text-end w-1/2">Feels like {currentApparentTemp}°{unitSymbol}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CurrentWeatherCard;