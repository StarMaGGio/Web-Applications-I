import {Container, Row, Col} from 'react-bootstrap'
import Sidebar from "./Sidebar"
import FilmList from "./FilmList"
import { useState } from 'react'
import { useParams } from 'react-router'
import dayjs from 'dayjs'

function Body(props) {
    let params = useParams()
    props.setActiveFilter(params.activeFilter)

    const filmList = props.library.list;

    function getFilteredFilms() {
    switch (params.activeFilter) {
        case 'favorites':
            return filmList.filter(f => f.favorite);
        case 'best-rated':
            return filmList.filter(f => f.rating == 5);
        case 'seen-last-month':
            return filmList.filter(f => f.watchDate && f.watchDate.isAfter(dayjs().subtract(1, 'month')));
        case 'unseen':
            return filmList.filter(f => f.watchDate == null)
        default: // All
            return filmList;
        }
    }

    const filteredFilms = getFilteredFilms()

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
                            filteredFilms={filteredFilms}
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