import {Container, Button} from 'react-bootstrap'

function Sidebar() {
    return(
        <>
            <Container fluid className='d-grid gap-1 align-items-left'>
                <h4 className='text-start'>Filters</h4>
                <Button variant='primary' className='text-start'>All Films</Button>
                <Button variant='light' className='text-start'>Favorites</Button>
                <Button variant='light' className='text-start'>Best Rated</Button>
                <Button variant='light' className='text-start'>Seen Last Month</Button>
                <Button variant='light' className='text-start'>Unseen</Button>
            </Container>
        </>
    )
}

export default Sidebar