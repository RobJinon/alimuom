interface CurrentWeatherCardProps {
    city:string;
    currentTemp:number | null;
    unitSymbol:string;
    formattedDate:string;
    currentApparentTemp:number | null;
}

function CurrentWeatherCard({city, currentTemp, unitSymbol, formattedDate, currentApparentTemp}: CurrentWeatherCardProps) {
    return ( 
        <div className="card lg:card-xl bg-primary py-5 w-full">
            <div className="card-body">
                <div className="flex flex-col items-center gap-y-2 w-full">
                    <div className="hidden lg:flex flex-row items-end w-full hidden">
                        <p className="text-3xl w-1/2">{city ? city : 'City not selected'}</p>
                        <p className="text-6xl text-end w-1/2">{currentTemp}°{unitSymbol}</p>
                    </div>
                    <div className="hidden lg:flex flex-row w-full items-start items-end gap-2">
                        <p className="text-sm w-1/2">{formattedDate}</p>
                    </div>

                    <div className="lg:hidden flex flex-col items-center w-full">
                        <p className="text-3xl">{city ? city : 'City not selected'}</p>
                        <p className="text-sm mt-5">{formattedDate}</p>
                        <p className="text-7xl mt-10">{currentTemp}°{unitSymbol}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CurrentWeatherCard;