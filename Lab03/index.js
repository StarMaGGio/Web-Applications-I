import dayjs from 'dayjs'
import express from 'express'
import morgan from 'morgan'
import { FilmLibrary } from "./FilmLibrary.js"
import { Film } from './Film.js'

const PREFIX = '/api/v1'

function printAll(films) {
    films.forEach((film) => {
        console.log(`${film}`)
    })
}

function errorResponse(err) {
    return {
        "error": err.message
    }
}

async function main() {
    const filmLibrary = new FilmLibrary()
    const app = express()

    const log = morgan('dev')
    app.use(log)
    app.use(express.json())

    // GET /films
    app.get(PREFIX + '/films', (req, res) => {
        filmLibrary.getAllFilms()
            .then(films => res.json(films))
            .catch(err => res.status(500).json(errorResponse(err)))
    })

    // GET /films/favorites
    app.get(PREFIX + '/films/favorites', (req, res) => {
        filmLibrary.getFavoriteFilms()
            .then(favFilms => res.json(favFilms))
            .catch(err => res.status(500).json(errorResponse(err)))
    })

    // GET /films/most-rated
    app.get(PREFIX + '/films/most-rated', (req, res) => {
        
    })

    // GET /films/recent-seen
    app.get(PREFIX + '/films/recent-seen', (req, res) => {
        filmLibrary.getLastMonthSeenFilms()
            .then(recentSeen => res.json(recentSeen))
            .catch(err => res.status(500).json(errorResponse(err)))
    })

    // GET /films/unseen

    app.listen(3000, () => { console.log('Server started') })
}

main()