import {Container, Row, Col} from 'react-bootstrap'
import Sidebar from "./Sidebar"
import FilmList from "./FilmList"

function Body() {
    return(
        <>
            <Container fluid className='mt-3'>
                <Row>
                    {/* filters Sidebar on the left */}
                    <Col xs={4}>
                        <Sidebar></Sidebar>
                    </Col>
                    
                    {/* films list on the right */}
                    <Col xs={8}>
                        <FilmList></FilmList>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Body