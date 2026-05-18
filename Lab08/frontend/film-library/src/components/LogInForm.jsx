import { useState } from "react"
import { Form, Button, Container, Row, Col } from "react-bootstrap"
import { doLogin } from "../api/auth"


function LogInForm(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errormsg, setErrormsg] = useState('')

    // Function launched when submitting the form to try logging in
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrormsg('')
        
        try{
            // validations
            if (email === "" || password === "") {
                throw new Error("Email or Password are empty!")
            }
            if (!/^\S+@\S+\.\S+$/.test(email)) {
                throw new Error("Please provide a valid email address.")
            }
            console.log(email, password)

            const user = await doLogin(email, password) // Fetch user through API
            // props.doLogin(user) // Do login in the frontend with the fetched user
        } catch (err) {
            setErrormsg(err.message)
        }
    }

    return (
        <Container>
            <Row className="justify-content-md-center mt-4">
                <Col md={4}>
                    <Form className="bg-light p-3 rounded" onSubmit={handleSubmit}>
                        {errormsg && <Form.Label className="text-danger">{errormsg}</Form.Label>}
                        <Form.Group className="mb-3" controlId="text">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            />
                        </Form.Group>
                        <Button className="mt-2" variant="primary" type="submit">
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default LogInForm