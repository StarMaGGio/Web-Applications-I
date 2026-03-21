import dayjs from 'dayjs'
import express from 'express'
import { param, body, validationResult } from 'express-validator'
import morgan from 'morgan'
import { FilmLibrary } from "./FilmLibrary.js"
import { Film } from './Film.js'

const PREFIX = '/api/v1'
const DATE_FORMAT = 'YYYY-MM-DD'

function internalError(res) {
    return err => res.status(500).json({"error": err.message})
}

function invalidInputParametersError(res, req) {
    res.status(500).json(validationResult(req).array())
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
            .catch(internalError(res))
    })

    // GET /films/favorites
    app.get(PREFIX + '/films/favorites', (req, res) => {
        filmLibrary.getFavoriteFilms()
            .then(favFilms => res.json(favFilms))
            .catch(internalError(res))
    })

    // GET /films/most-rated
    app.get(PREFIX + '/films/most-rated', (req, res) => {
        filmLibrary.getMostRatedFilms()
            .then(mostRated => res.json(mostRated))
            .catch(internalError(res))
    })

    // GET /films/recent-seen
    app.get(PREFIX + '/films/recent-seen', (req, res) => {
        filmLibrary.getLastMonthSeenFilms()
            .then(recentSeen => res.json(recentSeen))
            .catch(internalError(res))
    })

    // GET /films/unseen
    app.get(PREFIX + '/films/unseen', (req, res) => {
        filmLibrary.getUnseenFilms()
            .then(unseen => res.json(unseen))
            .catch(internalError(res))
    })

    // GET /films/:id
    app.get(PREFIX + '/films/:id', param('id').isInt({min:0}), async (req, res) => {
        if (validationResult(req).isEmpty()) {
            const id = req.params.id
            try {
                const film = await filmLibrary.getFilmById(id)
                res.json(film)
            } catch (err) {
                console.log(err)
                internalError(err)
            }
        } else {
            invalidInputParametersError(res, req)
        }
    })

    // POST /films/new-film
    app.post(PREFIX + '/films/new-film', [
        body('title').isString().notEmpty(),
        body('favorite').isInt({min:0, max:1}),
        body('watchDate').isDate({format: DATE_FORMAT}),
        body('rating').isInt({min:0, max:5})
    ], async (req, res) => {
        if (validationResult(req).isEmpty()) {
            const raw_film = req.body
            const film = new Film(null, raw_film.title, raw_film.favorite, raw_film.watchDate, raw_film.rating, 1)
            try {
                const id = await filmLibrary.addNewFilm(film)
                res.json({id: id})
            } catch (err) {
                internalError(err)
            }
        } else {
            invalidInputParametersError(res, req)
        }
    })

    // POST /films/update-film
    app.post(PREFIX + '/films/update-film', [
        body('id').isInt({min:0}).notEmpty(),
        body('title').optional().isString().notEmpty(),
        body('favorite').optional().isInt({min:0, max:1}),
        body('watchDate').optional().isDate({format: DATE_FORMAT}),
        body('rating').optional().isInt({min:0, max:5}),
        body('userId').optional().isInt({min:0})
    ], async (req, res) => {
        if (validationResult(req).isEmpty()) {
            const raw_update = req.body
            try {
                res.json(await filmLibrary.updateFilm(raw_update.id, raw_update.title, raw_update.isFavorite, raw_update.rating, raw_update.watchDate, raw_update.userId))
            } catch (err) {
                internalError(err)
            }
        } else {
            invalidInputParametersError(res, req)
        }
    })

    // POST /films/update-film-rating
    app.post(PREFIX + '/films/update-film-rating', [
        body('id').isInt({min:0}).notEmpty(),
        body('rating').isInt({min:0, max:5})
    ], async (req, res) => {
        if (validationResult(req).isEmpty()) {
            const id = req.body.id
            const newRating = req.body.rating
            try {
                res.json(await filmLibrary.updateFilm(id, undefined, undefined, newRating, undefined, undefined))
            } catch (err) {
                internalError(err)
            }
        } else {
            invalidInputParametersError(res, req)
        }
    })

    // POST /films/change-favorite
    app.post(PREFIX + '/films/change-favorite', [
        body('id').isInt({min:0}).notEmpty(),
        body('favorite').isInt({min:0, max:1})
    ], async (req, res) => {
        if (validationResult(req).isEmpty()) {
            const id = req.body.id
            const favorite = req.body.favorite
            try {
                res.json(await filmLibrary.updateFilm(id, undefined, favorite, undefined, undefined, undefined))
            } catch (err) {
                internalError(err)
            }
        } else {
            invalidInputParametersError(res, req)
        }
    })

    // DELETE /films/:id
    app.delete(PREFIX + '/films/:id', param('id').isInt({min:0}), async (req, res) => {
        if (validationResult(req).isEmpty()) {
            const id = req.params.id
            try {
                res.json(await filmLibrary.deleteFilmById(id))
            } catch (err) {
                internalError(err)
            }
        } else {
            invalidInputParametersError(res, req)
        }
    })

    app.listen(3000, () => { console.log('Server started') })
}

main()