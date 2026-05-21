import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useContext, useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router';
import { Button, Container } from 'react-bootstrap';

import FilmLibrary from './models/FilmLibrary.js'
import Film from './models/Film.js'

import Header from './components/Header'
import Body from './components/Body'
import AddEditFilmForm from './components/AddEditFilmForm';
import { LogInForm, Logout } from './components/LogInForm.jsx';

import UserContext from './contexts/UserContext.js'

import { checkSessionAPI } from './api/auth.js';
import { getFilmsAPI } from './api/api.js';

function App() {
  // Hooks
  const [library, setLibrary] = useState(new FilmLibrary())
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

  // Try to restore login session on page reload
  useEffect(() => {
    checkSessionAPI().then(res => {
      setUser({id: res.id, name: res.name})
    })
  }, [])

  // Login action handler
  const doLogin = (user) => {
    setUser({id: user.id, name: user.name})

    navigate(`/film-library/${activeFilter}`)
  }

  // Returned component
  return (
    <UserContext.Provider value={user}>
      <Routes>
        <Route path='/' element={<MainLayout user={user}/>}>
          <Route index element={<LoginView doLogin={doLogin} activeFilter={activeFilter}/>} />
          <Route path='film-library/:activeFilter' element={<Body library={library} setLibrary={setLibrary} setActiveFilter={setActiveFilter} setMode={setMode} deleteFilm={deleteFilm} mode={mode} setSelectedFilmId={setSelectedFilmId} />}/>
          <Route path='add-film' element={<AddEditFilmForm setMode={setMode} addFilm={addFilm} goal={mode} activeFilter={activeFilter} />}/>
          <Route path='edit-film' element={<AddEditFilmForm setMode={setMode} editFilm={editFilm} goal={mode} selectedFilmId={selectedFilmId} activeFilter={activeFilter} />}/>
          <Route path='logout' element={<Logout doLogin={doLogin} />} />
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
      <LogInForm doLogin={props.doLogin}/>
    </>
  )
}

// No Match component
function NoMatch() {
  return "ERROR 404: Page not found"
}

export default App
