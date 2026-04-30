import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header'
import Body from './components/Body'
import FilmLibrary from './models/FilmLibrary.js'
import Film from './models/Film.js'
import { useState } from 'react'

function App() {
  const filmLibrary = new FilmLibrary()

  filmLibrary.addFilm(new Film(1, "Pulp Fiction", true, '03-10-2026', 4, 1))
  filmLibrary.addFilm(new Film(2, "21 Grams", false, '03-17-2026', 3, 1))
  filmLibrary.addFilm(new Film(3, "Star Wars", false, null, 0, 1))
  filmLibrary.addFilm(new Film(4, "Matrix", false, null, 0, 1))
  filmLibrary.addFilm(new Film(5, "Shrek 2", true, '03-21-2026', 5, 1))

  const [library, setLibrary] = useState(filmLibrary)

  // Function to add a new film to the list to be passed
  const addFilm = (title, isFavorite, date, rating) => {
    const newId = Math.max( ... library.list.map(f=>f.id) ) + 1

    const newFilm = new Film(newId, title, isFavorite, date, rating, 1)

    setLibrary(prevState => {
		const newState = new FilmLibrary(prevState.list)
		return {...newState.addFilm(newFilm)}
	})
  }

  return (
    <>
      <Header></Header>

      <Body library={library} addFilm={addFilm}></Body>
    </>
  )
}

export default App
