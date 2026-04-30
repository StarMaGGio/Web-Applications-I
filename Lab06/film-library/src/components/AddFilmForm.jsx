import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import dayjs from "dayjs";
import validator from 'validator';

function AddFilmForm(props) {
  const [title, setTitle] = useState("");
  const [watchDate, setWatchDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [rating, setRating] = useState();
  const [validationWarning, setValidationWarning] = useState(false);
  const [warningText, setWarningText] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate data
    if (validator.isEmpty(title)) {
        setWarningText("Title must not be empty!")
        setValidationWarning(true)
        return
    }
    if (!validator.isInt(rating, {min: 0, max: 5})) {
        setWarningText("Score must be in range 0-5!")
        setValidationWarning(true)
        return
    }

    // Update film list using props
    props.addFilm(title, false, dayjs(watchDate), rating)

    // Close the form
    props.setMode("display");
  };

  return (
    <Form className="bg-light" onSubmit={handleSubmit}>
      {validationWarning && <Form.Label className="text-danger">{warningText}</Form.Label>}
      <Form.Group>
        <Form.Label>Film title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Amazing title..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        ></Form.Control>
        <Form.Label>Watch date</Form.Label>
        <Form.Control
          type="date"
          value={watchDate}
          onChange={(e) => setWatchDate(e.target.value)}
        ></Form.Control>
        <Form.Label>Rating</Form.Label>
        <Form.Control
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        ></Form.Control>
      </Form.Group>
      <Button variant="primary" type="submit">
        Add Film
      </Button>
      <Button
        variant="secondary"
        type="cancel"
        onClick={() => props.setMode("display")}
      >
        Cancel
      </Button>
    </Form>
  );
}

export default AddFilmForm