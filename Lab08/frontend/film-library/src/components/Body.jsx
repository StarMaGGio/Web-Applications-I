import {Container, Row, Col} from 'react-bootstrap'
import Sidebar from "./Sidebar"
import FilmList from "./FilmList"
import { useState, useContext, useEffect } from 'react'
import { useParams, Navigate } from 'react-router'
import dayjs from 'dayjs'
import UserContext from '../contexts/UserContext'
import { getFilmsAPI } from '../api/api'
import FilmLibrary from '../models/FilmLibrary.js'

function Body(props) {
    const user = useContext(UserContext)
    if (!user.id)
        return <Navigate to='/'/>

    let params = useParams()

    useEffect(() => {
        props.setActiveFilter(params.activeFilter)                                             // Set the (new) Filter
        getFilmsAPI(params.activeFilter).then(res => {props.setLibrary(new FilmLibrary(res))}) // Fetch films from backend by the active filter
    }, [params.activeFilter])

    return(
        <>
            <Container fluid className='mt-3'>
                <Row>
                    {/* filters Sidebar on the left */}
                    <Col xs={4}>
                        <Sidebar activeFilter={params.activeFilter}></Sidebar>
                    </Col>
                    
                    {/* films list on the right */}
                    <Col xs={8}>
                        <FilmList  
                            filteredFilms={props.library.list}
                            filterName={props.activeFilter}
                            setMode={props.setMode}
                            mode={props.mode}
                            deleteFilm={props.deleteFilm}
                            setSelectedFilmId={props.setSelectedFilmId}>
                        </FilmList>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Body