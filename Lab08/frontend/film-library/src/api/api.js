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

async function addFilmAPI(title, favorite, watchDate, rating) {
    try {
        const response = await fetch('http://localhost:3000/api/v1/films/new-film', {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                favorite: favorite ? 1 : 0,
                watchDate: watchDate ? (watchDate.format ? watchDate.format('YYYY-MM-DD') : watchDate) : null,
                rating: rating ? rating : null
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })

        if (response.ok) {
            return true
        } else {
            const errBody = await response.json()
            throw new Error(`Error in addFilmAPI: ${JSON.stringify(errBody)}`)
        }
    } catch (ex) {
        throw new Error("Network error in addFilmAPI: ", {cause: ex})
    }
}

async function editFilmAPI(id, title, favorite, watchDate, rating, userId) {
    try {
        const response = await fetch('http://localhost:3000/api/v1/films/update-film', {
            method: 'POST',
            body: JSON.stringify({
                id: id,
                title: title,
                favorite: favorite ? 1 : 0,
                watchDate: watchDate ? (watchDate.format ? watchDate.format('YYYY-MM-DD') : watchDate) : null,
                rating: rating ? rating : null,
                userId: userId
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })

        if (response.ok) {
            return true
        } else {
            const errBody = await response.json()
            throw new Error(`Error in editFilmAPI: ${JSON.stringify(errBody)}`)
        }
    } catch (ex) {
        throw new Error("Network error in editFilmAPI: ", {cause: ex})
    }
}

export { getFilmsAPI, addFilmAPI, editFilmAPI }