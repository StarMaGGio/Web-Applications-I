async function getFilmsAPI(filter) {
    try {
        const response = await fetch(`http://localhost:3000/api/v1/films/${filter}`, {
            method: 'GET',
            credentials: 'include'
        })

        if (response.ok) {
            const films = await response.json()
            return films
        } else {
            throw new Error('HTTP error in getFilmsAPI, code = ' + response.status)
        }
    } catch (ex) {
        throw new Error("Network error", {cause: ex})
    }
}

export { getFilmsAPI }