import { Cog6ToothIcon, ChevronDownIcon, CloudIcon } from "@heroicons/react/24/solid";

interface NavbarProps {
    unit:string;
    setUnit: React.Dispatch<React.SetStateAction<string>>;
}

function Navbar({unit, setUnit}: NavbarProps) {
    return (
        <div className="navbar bg-none">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">
                    <CloudIcon className="size-9 text-accent"/>
                    Alimuom
                </a>
            </div>
            <div className="flex">
                <div className="dropdown dropdown-end">
                    <button className="btn btn-neutral">
                        <Cog6ToothIcon className="size-4" />
                        Units
                        <ChevronDownIcon className="size-4" />
                    </button>
                    <ul
                        tabIndex={-1}
                        className="menu dropdown-content bg-neutral font-semibold text-xs rounded-box z-1 mt-2 p-2 w-full shadow-md">
                        <li><a  id='btn_celsius' 
                                onClick={() => setUnit('celsius')}
                                className={`${ unit === 'celsius' ? 'text-accent' :'' }`}
                            >°C Celsius</a></li>

                        <li><a  id='btn_farenheit' 
                                onClick={() => setUnit('fahrenheit')}
                                className={`${ unit === 'farenheit' ? 'text-accent' :'' }`}
                            >°F Farenheit</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Navbar;