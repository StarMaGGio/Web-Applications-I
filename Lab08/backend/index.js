import dayjs from 'dayjs'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { param, body, validationResult } from 'express-validator'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import session from 'express-session'

import { FilmLibrary } from "./FilmLibrary.js"
import { Film } from './Film.js'

const PREFIX = '/api/v1'
const DATE_FORMAT = 'YYYY-MM-DD' 

function internalError(res) {
    return err => res.status(500).json({"error": err.message})
}

function invalidInputParametersError(res, req) {
    res.status(400).json(validationResult(req).array())
}

async function main() {

/* --- SERVER INITIALIZATION AND CONFIGURATION --- */

    // Database initialization 
    const filmLibrary = new FilmLibrary()

    // Express configuration
    const app = express()
    app.use(express.json())

    // Morgan configuration
    const log = morgan('dev')
    app.use(log)

    // CORS configuration
    const corsOptions = {
        origin: 'http://localhost:5173',
        optionsSuccessState: 200,
        credentials: true
    }
    app.use(cors(corsOptions))

    // Passport and session configuration
    passport.use(new LocalStrategy(async function verify(email, password, cb) { // cb is the callback function that we have to call at the end of the verification process, it takes three parameters: error, user, and info (optional)
        const user = await filmLibrary.getUser(email, password)                 // Returns the user if the email and password are correct, null otherwise

        if (!user) return cb(null, false, "Incorrect email or password.")       // If the user is null, then the email and password are not correct, so we return false and an error message
        // else
        return cb(null, user)                                                   // If the user is not null, then the email and password are correct, so we return the user
    }))

    passport.serializeUser(function (user, cb) {    // This function is called when the user is authenticated
        cb(null, user)                              // We serialize the user by storing the whole user object in the session
    })

    passport.deserializeUser(function (user, cb) {  // This function is called when the user makes a request and we need to deserialize the user from the session
        return cb(null, user)                       // We deserialize the user by returning the user object stored in the session       
    })

    const isLoggedIn = (req, res, next) => {        // This is a middleware function that checks if the user is authenticated, if not it returns a 401 error
        if(req.isAuthenticated()) {
            return next()
        }
        console.log(req.user)
        return res.status(401).json({error: "Not authorized!"})
    }

    app.use(session({
        secret: "Secret phrase",                // This is the secret used to sign the session ID cookie 
        resave: false,         
        saveUninitialized: false
    }))
    app.use(passport.authenticate("session"))   // This middleware is used to initialize Passport and restore authentication state, if any, from the session

/* --- ROUTES --- */

    // POST /auth/login
    app.post(PREFIX + '/auth/login', passport.authenticate("local"), (req, res) => {
        return res.status(201).json(req.user)
    })

    // GET /sessions/current
    app.get(PREFIX + '/sessions/current', (req, res) => {
        if (req.isAuthenticated()) {
            res.json(req.user)
        } else {
            res.status(401).json({error: "Not authenticated!"})
        }
    })

    // DELETE /sessions/current
    app.delete(PREFIX + '/sessions/current', (req, res) => {
        req.logout(() => {
            res.end()
        })
    })

    app.use(isLoggedIn)

    // GET /films/:filter
    app.get(PREFIX + '/films/:filter', (req, res) => {
        const userId = req.user.id;

        switch (req.params.filter) {
            case 'all-films':
                filmLibrary.getAllFilms(userId)
                    .then(films => res.json(films))
                    .catch(internalError(res))
                break;
            case 'favorites':
                filmLibrary.getFavoriteFilms(userId)
                    .then(favFilms => res.json(favFilms))
                    .catch(internalError(res))
                break;
            case 'best-rated':
                filmLibrary.getMostRatedFilms(userId)
                    .then(mostRated => res.json(mostRated))
                    .catch(internalError(res))
                break;
            case 'seen-last-month':
                filmLibrary.getLastMonthSeenFilms(userId)
                    .then(recentSeen => res.json(recentSeen))
                    .catch(internalError(res))
                break;
            case 'unseen':
                filmLibrary.getUnseenFilms(userId)
                    .then(unseen => res.json(unseen))
                    .catch(internalError(res))
                break;
            default:
                // return error: filter does not exists
                break;
        }
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
                res.status(201).json({id: id})
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

/* --- SERVER STARTUP --- */

    app.listen(3000, () => { console.log('Server started') })
}

main()