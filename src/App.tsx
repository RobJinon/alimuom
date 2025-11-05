import './App.css'
import { useState, useEffect } from 'react'

//Components
import Navbar from './components/Navbar'
import Searchbar from './components/Searchbar'

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
    </div>
  )
}

export default App
