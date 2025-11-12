import './App.css'
import { useState, useEffect } from 'react'

//Components
import Navbar from './components/Navbar'
import Searchbar from './components/Searchbar'
import CurrentWeatherCard from './components/CurrentWeatherCard'

function App() {
  const [unit, setUnit] = useState('celsius')
  const [city, setCity] = useState('')
  const [coordinates, setCoordinates] = useState<{lat:number; lon:number} | null >(null)

  useEffect(() => {
    console.log('Unit changed to:', unit)
  }, [unit])

  useEffect(() => {
    console.log('City set to:', city)
  }, [city])

  useEffect(() => {
    console.log('Coordinates set to:', coordinates)
  }, [coordinates])

  return (
    <div className='min-w-screen max-w-screen min-h-screen flex flex-col align-center md:p-10 md:px-20 p-2 '>
      <Navbar unit={unit} setUnit={setUnit} />
      <Searchbar setCity={setCity} setCoordinates={setCoordinates}/>

      <div className="flex flex-row m-3 p-5">
        <div className="flex flex-col w-2/3">
          <div className="flex w-full">
            <CurrentWeatherCard city={city} unit={unit} coordinates={coordinates}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
