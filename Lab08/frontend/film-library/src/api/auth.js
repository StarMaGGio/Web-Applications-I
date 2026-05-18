async function doLogin(email, password) {
    const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify( {
            email: email,
            password: password
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    if (response.ok) {
        const user = await response.json()
        return user
    } else {
        throw new Error("Login failed")
    }
}

export {doLogin}