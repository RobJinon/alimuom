interface CurrentWeatherDetailCardProps {
    title:string;
    content:string;
}

function CurrentWeatherDetailCard({title, content}: CurrentWeatherDetailCardProps) {
    return ( 
        <div className="card bg-accent text-base-100 items-start min-w-1/2 lg:min-w-1/4">
            <div className="card-body">
                <div className="card-title text-sm">{title}</div>
                <p className="text-3xl font-bold">{content}</p>
            </div>
        </div>
     );
}

export default CurrentWeatherDetailCard;