interface DailyForecastCardProps {
    day: string | Date;
    temperature: number | undefined;
    precipitation_probability: number | undefined;
    uv_index: number | undefined;
}

function DailyForecastCard({ day, temperature, precipitation_probability, uv_index }: DailyForecastCardProps) {
    const dayName = day instanceof Date 
        ? day.toLocaleDateString("en-US", { weekday: "short" }) 
        : "";

    const dateString = day instanceof Date 
        ? day.toLocaleDateString("en-US", { month: "short", day: "numeric" }) 
        : day;

    return ( 
        <div className="card card-sm bg-secondary text-base-100 items-start min-w-[50%] lg:min-w-[25%]">
            <div className="card-body gap-0 w-full">
                <div className="card-title">{dayName}</div>
                <p className="text-xs mb-3">{dateString}</p>
                <p className="text-sm">{temperature?.toFixed(1)}°C</p>
                <p className="text-sm">{precipitation_probability}%</p>
                <p className="text-sm">{Math.round(uv_index*10)/10}</p>
            </div>
        </div>
    );
}

export default DailyForecastCard;
