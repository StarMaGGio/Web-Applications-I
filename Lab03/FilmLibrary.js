import sqlite from 'sqlite3'
import dayjs from 'dayjs'
import { Film } from './Film.js'

const DATE_FORMAT = 'YYYY-MM-DD'

function mapRowsToFilms(rows) {
    return rows.map(row => new Film(row.id, row.title, row.isFavorite, row.watchDate, row.rating, row.userId))
}

function FilmLibrary() {
    // Initialization of the films database
    const db = new sqlite.Database('films.db', (err) => {
    if(err)
        console.log("Error in opening database")
    else
        console.log("Database connected successfully")
    })

    // Method to retrieve all the stored films and return them in a Promise
    this.getAllFilms = function() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films'
            db.all(sql, (err, rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(mapRowsToFilms(rows))
                }
            })
        })
    }

    // Method to retrieve all favorite films
    this.getFavoriteFilms = function() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE isFavorite == 1'
            db.all(sql, (err, rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(mapRowsToFilms(rows))
                }
            })
        })
    }

    // Method to retrieve all films before the date passed as parameter
    this.getFilmsBeforeDate = function(date) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE watchDate < ?'
            db.all(sql, [date.format(DATE_FORMAT)], (err, rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(mapRowsToFilms(rows))
                }
            })
        })
    }

    // Method to retrieve a film by his title
    this.getFilmByTitle = function(title) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE title LIKE ?'
            db.all(sql, [`%${title}%`], (err, rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(mapRowsToFilms(rows))
                }
            })
        })
    }

    // Method to store a new film into the database
    this.addNewFilm = function(film) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO films (title, isFavorite, rating, watchDate, userId) VALUES (?, ?, ?, ?, ?)'
            db.run(sql, [`${film.title}`, film.favorite, film.rating, `${film.watchDate}`, film.userId], function(err) {
                if(err) reject(err)
                else resolve(this.lastID)
            })
        })
    }

    // Method to delete a movie from the database by his id
    this.deleteFilmById = function(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM films WHERE id == ?'
            db.run(sql, [id], (err) => {
                if(err) reject(err)
                else resolve('Film successfully deleted from the Database!')
            })
        })
    }

    // Method to delete the watch date of all films stored in the database
    this.deleteAllWatchDates = function() {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE films SET watchDate = NULL'
            db.run(sql, (err) => {
                if(err) reject(err)
                else resolve('Watch date deleted from all films stored in the database!')
            })
        })
    }

    // Method to retrieve all films seen in the last month
    this.getLastMonthSeenFilms = function() {
        const today = dayjs().format(DATE_FORMAT)
        const lastMonth = dayjs().subtract(1, 'month').format(DATE_FORMAT)

        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE watchDate >= ? AND watchDate <= ? ORDER BY watchDate DESC'
            db.all(sql, [lastMonth, today], (err, rows) => {
                if(err) reject(err)
                else resolve(mapRowsToFilms(rows))
            })
        })
    }

    // Method to retrieve the most rated films (rating == 5)
    this.getMostRatedFilms = function() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE rating == 5'
            db.all(sql, (err, rows) => {
                if(err) reject(err)
                else resolve(mapRowsToFilms(rows))
            })
        })
    }

    // Method to return unseen films (watchDate IS NULL)
    this.getUnseenFilms = function() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE watchDate IS NULL'
            db.all(sql, (err, rows) => {
                if(err) reject(err)
                else resolve(mapRowsToFilms(rows))
            })
        })
    }

    // Method to return a film by its id
    this.getFilmById = function(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE id == ?'
            db.all(sql, [id], (err, rows) => {
                if(err) reject(err)
                else resolve(mapRowsToFilms(rows))
            })
        })
    }
}

export{FilmLibrary}