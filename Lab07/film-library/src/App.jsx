import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header'
import Body from './components/Body'
import FilmLibrary from './models/FilmLibrary.js'
import Film from './models/Film.js'
import { useState, useContext } from 'react'
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router';
import { Button, Container } from 'react-bootstrap';
import AddEditFilmForm from './components/AddEditFilmForm.jsx';
import UserContext from './contexts/UserContext.js'

function App() {
  // Film library database
  const filmLibrary = new FilmLibrary()

  filmLibrary.addFilm(new Film(1, "Pulp Fiction", true, '03-10-2026', 4, 1))
  filmLibrary.addFilm(new Film(2, "21 Grams", false, '03-17-2026', 3, 1))
  filmLibrary.addFilm(new Film(3, "Star Wars", false, null, 0, 1))
  filmLibrary.addFilm(new Film(4, "Matrix", false, null, 0, 1))
  filmLibrary.addFilm(new Film(5, "Shrek 2", true, '03-21-2026', 5, 1))

  // Hooks
  const [library, setLibrary] = useState(filmLibrary)
  const navigate = useNavigate()
  const [mode, setMode] = useState('display')
  const [selectedFilmId, setSelectedFilmId] = useState()
  const [activeFilter, setActiveFilter] = useState('all-films');
  const [user, setUser] = useState({id: undefined, name: undefined})

  // Function to delete a film from the list
  const deleteFilm = (id) => {
    setLibrary(prevState => {
      const newState = new FilmLibrary(prevState.list)
      return {...newState.removeFilm(id)}
    })
  }

  // Function to add a new film to the list to be passed
  const addFilm = (title, isFavorite, date, rating) => {
    const newId = Math.max( ... library.list.map(f=>f.id) ) + 1

    const newFilm = new Film(newId, title, isFavorite, date, rating, 1)

    setLibrary(prevState => {
      const newState = new FilmLibrary(prevState.list)
      return {...newState.addFilm(newFilm)}
	  })
  }

  // Function to edit a film in the list
  const editFilm = (id, title, isFavorite, date, rating) => {
    setLibrary(prevState => {
      const newState = new FilmLibrary(prevState.list)
      return {...newState.updateRating(id, rating)}
    })
  }

  // Function to simulate login
  const doLogin = () => {
    setUser({id: 1, name: 'User-A'})
    navigate(`/film-library/${activeFilter}`)
  }

  // Returned component
  return (
    <UserContext.Provider value={user}>
      <Routes>
        <Route path='/' element={<MainLayout user={user}/>}>
          <Route index element={<LoginView doLogin={doLogin} activeFilter={activeFilter}/>} />
          <Route path='film-library/:activeFilter' element={<Body library={library} activeFilter={activeFilter} setActiveFilter={setActiveFilter} setMode={setMode} deleteFilm={deleteFilm} mode={mode} setSelectedFilmId={setSelectedFilmId} />}/>
          <Route path='add-film' element={<AddEditFilmForm setMode={setMode} addFilm={addFilm} goal={mode} activeFilter={activeFilter} />}/>
          <Route path='edit-film' element={<AddEditFilmForm setMode={setMode} editFilm={editFilm} goal={mode} selectedFilmId={selectedFilmId} activeFilter={activeFilter} />}/>
          <Route path="*" element={<NoMatch/>} />
        </Route>
      </Routes>
    </UserContext.Provider>
  )
}

// Main layout component
function MainLayout(props) {
  return (
    <>
      <Header user={props.user}></Header>
      <Outlet/>
    </>
  )
}

// Login component
function LoginView(props) {
  const user = useContext(UserContext)
  if (user.id)
    return <Navigate to={`/film-library/${props.activeFilter}`}/>
  
  return (
    <>
      <p>"Please login to see your films..."</p>
      <Button onClick={() => props.doLogin()}>Login</Button>
    </>
  )
}

// No Match component
function NoMatch() {
  return "ERROR 404: Page not found"
}

export default App
