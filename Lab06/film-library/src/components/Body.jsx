import {Container, Row, Col} from 'react-bootstrap'
import Sidebar from "./Sidebar"
import FilmList from "./FilmList"
import { useState } from 'react'
import dayjs from 'dayjs'

function Body(props) {

    const [activeFilter, setActiveFilter] = useState('All');
    const filmList = props.library.list;

    function getFilteredFilms() {
    switch (activeFilter) {
        case 'Favorites':
            return filmList.filter(f => f.favorite);
        case 'Best Rated':
            return filmList.filter(f => f.rating == 5);
        case 'Seen Last Month':
            return filmList.filter(f => f.watchDate && f.watchDate.isAfter(dayjs().subtract(1, 'month')));
        case 'Unseen':
            return filmList.filter(f => f.watchDate == null)
        default: // All
            return filmList;
        }
    }

    const filteredFilms = getFilteredFilms()

    const [mode, setMode] = useState('display')

    return(
        <>
            <Container fluid className='mt-3'>
                <Row>
                    {/* filters Sidebar on the left */}
                    <Col xs={4}>
                        <Sidebar onFilterChange={setActiveFilter} activeFilter={activeFilter}></Sidebar>
                    </Col>
                    
                    {/* films list on the right */}
                    <Col xs={8}>
                        <FilmList filteredFilms={filteredFilms} filterName={activeFilter} setMode={setMode} mode={mode}></FilmList>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Body