import {Container, Button} from 'react-bootstrap'
import { useNavigate } from 'react-router';

function Sidebar({onFilterChange, activeFilter}) {
    const navigate = useNavigate()

    const filters = [
        {name: 'all-films', label: 'All Films'},
        {name: 'favorites', label: 'Favorites'},
        {name: 'best-rated', label: 'Best Rated'},
        {name: 'seen-last-month', label: 'Seen Last Month'},
        {name: 'unseen', label: 'Unseen'}
    ];

    return(
        <>
            <Container fluid className='d-grid gap-1 align-items-left'>
                <h4 className='text-start'>Filters</h4>
                {filters.map(f => (
                    <Button
                        key={f.name}
                        className={`btn text-start ${activeFilter == f.name ? 'btn-primary' : 'btn-light'}`}
                        onClick={() => navigate(`/film-library/${f.name}`)}>
                        {f.label}
                    </Button>
                ))}
            </Container>
        </>
    )
}

export default Sidebar