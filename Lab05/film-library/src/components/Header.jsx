import {Navbar, Container, Nav, Form} from 'react-bootstrap'

function Header() {
    
    return(
        <>
            <Navbar bg="primary">
                <Container fluid>
                    {/* this block is on the left part of the Navbar */}
                    <Navbar.Brand className="d-flex align-items-center">
                        <i className="bi bi-collection-play me-2 text-white fs-3"></i>
                        <span className='text-white'>Film Library</span>
                    </Navbar.Brand>
                    {/* this block is on the right part of the Navbar */}
                    <Nav className="d-flex align-items-center ms-auto">
                        <Form className='me-3'>
                            <Form.Control
                                type='search'
                                style={{ width: '50vw', maxWidth: '500px', minWidth: '150px'}}
                                placeholder="Search" />
                        </Form>
                        <i className="bi bi-person-circle text-white fs-3"></i>
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}

export default Header