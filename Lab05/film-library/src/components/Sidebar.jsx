import {Container, Button} from 'react-bootstrap'

function Sidebar({onFilterChange, activeFilter}) {
    const filters = [
        {name: 'All', label: 'All Films'},
        {name: 'Favorites', label: 'Favorites'},
        {name: 'Best Rated', label: 'Best Rated'},
        {name: 'Seen Last Month', label: 'Seen Last Month'},
        {name: 'Unseen', label: 'Unseen'}
    ];

    return(
        <>
            <Container fluid className='d-grid gap-1 align-items-left'>
                <h4 className='text-start'>Filters</h4>
                {filters.map(f => (
                    <Button
                        key={f.name}
                        className={`btn text-start ${activeFilter === f.name ? 'btn-primary' : 'btn-light'}`}
                        onClick={() => onFilterChange(f.name)}>
                        {f.label}
                    </Button>
                ))}
            </Container>
        </>
    )
}

export default Sidebar