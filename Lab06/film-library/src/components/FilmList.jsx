import { Container, Table, Button} from "react-bootstrap";
import AddFilmForm from "./AddFilmForm";

function FilmList(props) {
  const filteredFilms = props.filteredFilms;

  return (
    <>
      <Container fluid className="d-grid gap-1 align-items-left">
        <h1 className="text-start">{props.filterName}</h1>
        <Table>
          <tbody>
            {filteredFilms.map((f) => (
              <FilmRow key={f.id} f={f}></FilmRow>
            ))}
          </tbody>
        </Table>
      </Container>
      {props.mode == "display" && (
        <Button
          variant="primary"
          className="rounded-circle position-fixed bottom-0 end-0  me-3 mb-3"
          onClick={() => props.setMode("add")}
        >
          <i className="bi bi-plus-lg"></i>
        </Button>
      )}
      {props.mode == "add" && <AddFilmForm setMode={props.setMode} addFilm={props.addFilm}/>}
    </>
  );
}

function FilmRow(props) {
  const film = props.f;
  return (
    <tr className="align-middle">
      <td>
        <div className="d-flex align-items-center gap-2">
          <Favorite fav={film.favorite}></Favorite>
          <span>{film.title}</span>
        </div>
      </td>
      <td className="text-center text-nowrap">
        <span>
          {film.watchDate != null ? film.watchDate.format("DD MMMM, YYYY") : ""}
        </span>
      </td>
      <td>
        <div className="d-flex justify-content-end align-items-center gap-3">
          <Score score={film.rating}></Score>
          <div>
            <Button variant="light">
              <i className="bi bi-pencil-square"></i>
            </Button>
            <Button variant="light">
              <i className="bi bi-trash"></i>
            </Button>
          </div>
        </div>
      </td>
    </tr>
  );
}

function Favorite(props) {
  if (props.fav == true) {
    return <i className="bi bi-heart-fill" style={{ color: "red" }}></i>;
  } else {
    return <i className="bi bi-heart"></i>;
  }
}

function Score(props) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={{ color: "gold" }}>
      {stars.map((i) => (
        <i
          key={i}
          className={i <= props.score ? "bi bi-star-fill" : "bi bi-star"}
        ></i>
      ))}
    </div>
  );
}

export default FilmList;
