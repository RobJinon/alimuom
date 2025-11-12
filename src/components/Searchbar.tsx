import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";

interface SearchbarProps {
    setCity: React.Dispatch<React.SetStateAction<string>>;
    setCoordinates: React.Dispatch<React.SetStateAction<{ lat: number; lon: number } | null>>;
}

function Searchbar({setCity, setCoordinates}: SearchbarProps) {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [showDropdown, setShowDropdown] = useState(false)

    useEffect(() => {
        const fetchCityFromCoordinates = async () => {
            if (!navigator.geolocation) return;

            navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;

                setCoordinates({ lat: latitude, lon: longitude });

                try {
                const result = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`
                );
                const data = await result.json();

                if (data.results && data.results.length > 0) {
                    const city = data.results[0];
                    setCity(`${city.name}, ${city.country}`);
                    setQuery(`${city.name}, ${city.country}`);
                }
                } catch (error) {
                console.error("Error fetching city from coordinates:", error);
                }
            },
            (err) => console.warn("Geolocation denied or unavailable:", err)
            );
        };

        fetchCityFromCoordinates();
    }, [setCity, setCoordinates]);

    useEffect(() => {
        const fetchCities = async () => {
            if (query.length < 2) {
                setSuggestions([])
                return
            }

            try {
                const result = await fetch( `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`)

                const data = await result.json()
                setSuggestions(data.results || [])
                setShowDropdown(true)
            }
            catch (error) {
                console.error("Error fetcing city data:", error)
            } 
        }

        const delay = setTimeout(fetchCities, 400)
        return () => clearTimeout(delay)
    }, [query])

    const handleSelect = (city: any) => {
        setCity(`${city.name}, ${city.country}`);
        setCoordinates({ lat: city.latitude, lon: city.longitude });
        setQuery(`${city.name}, ${city.country}`);
        setShowDropdown(false);
    };

    return (
        <div className="flex justify-center">
            <div className="dropdown w-full max-w-sm">
                <div tabIndex={0} role="button" className="w-full">
                    <label className="input input-bordered flex items-center gap-2 w-full">
                    <MagnifyingGlassIcon className="size-4 opacity-70" />
                    <input
                        type="search"
                        className="grow"
                        value={query}
                        placeholder="Search for cities"
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    />
                    </label>
                </div>
                {showDropdown && suggestions.length > 0 && (
                    <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu bg-base-200 rounded-box w-full mt-2 shadow"
                    >
                    {suggestions.map((city) => {
                        const locationParts = [
                            city.name,
                            city.admin3,
                            city.admin2,
                            city.admin1,
                            city.country
                        ].filter(Boolean); // remove undefined/null/empty entries

                        return (
                            <li key={city.id}>
                                <a onClick={() => handleSelect(city)}>
                                    {locationParts.join(", ")}
                                </a>
                            </li>
                        );
                    })}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Searchbar;