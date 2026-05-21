async function doLoginAPI(email, password) {
    const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify( {
            username: email,
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

async function doLogoutAPI() {
    const response = await fetch('http://localhost:3000/api/v1/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    })

    if (response.ok) {
        return true
    } else {
        throw new Error("Logout failed")
    }
}

async function checkSessionAPI() {
    const response = await fetch('http://localhost:3000/api/v1/sessions/current', {
        credentials:"include"
    })
    if (response.ok) {
        return await response.json()
    } else {
        return null
    }
}

export {doLoginAPI, doLogoutAPI, checkSessionAPI }