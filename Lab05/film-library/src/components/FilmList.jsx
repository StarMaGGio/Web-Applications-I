import {Container, Table, Button} from 'react-bootstrap'

function FilmList() {
    return(
        <>
            <Container fluid className='d-grid gap-1 align-items-left'>
                <h1 className='text-start'>All Films</h1>
                <Table>
                    <tbody>
                        <tr className='align-middle'>
                            <td>
                                <div className='d-flex align-items-center gap-2'>
                                    <i class="bi bi-heart-fill" style={{color: "red"}}></i> 
                                    <span>Pulp Fiction</span>
                                </div>
                            </td>
                            <td className="text-center text-nowrap">
                                <span>March 10, 2026</span>
                            </td>
                            <td>
                                <div className="d-flex justify-content-end align-items-center gap-3">
                                    <div style={{color: "gold"}}>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star"></i>
                                    </div>
                                    <div>
                                        <Button variant='light'><i class="bi bi-pencil-square"></i></Button>
                                        <Button variant='light'><i class="bi bi-trash"></i></Button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        </>
    )
}

export default FilmList