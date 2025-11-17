interface CurrentWeatherDetailCardProps {
    title:string;
    content:string | number;
    unit:string;
}

function CurrentWeatherDetailCard({title, content, unit}: CurrentWeatherDetailCardProps) {
    return ( 
        <div className="card bg-accent text-base-100 items-start min-w-1/2 lg:min-w-1/4">
            <div className="card-body w-full">
                <div className="card-title text-md">{title}</div>
                <div className="flex flex-row items-end mt-5 gap-x-2">
                    <p className="text-3xl flex-none font-bold">{content}</p>
                    <p className="text-2xl flex-none font-semibold">{unit}</p>
                </div>
            </div>
        </div>
     );
}

export default CurrentWeatherDetailCard;