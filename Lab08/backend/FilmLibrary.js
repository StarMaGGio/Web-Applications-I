/* --- DAO --- */

import sqlite from 'sqlite3'
import dayjs from 'dayjs'
import { Film } from './Film.js'
import crypto from 'crypto'

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
    this.getAllFilms = function(userId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE userId = ?'
            db.all(sql, [userId], (err, rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(mapRowsToFilms(rows))
                }
            })
        })
    }

    // Method to retrieve all favorite films
    this.getFavoriteFilms = function(userId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE isFavorite == 1 AND userId = ?'
            db.all(sql, [userId], (err, rows) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(mapRowsToFilms(rows))
                }
            })
        })
    }

    // Method to retrieve all films before the date passed as parameter
    this.getFilmsBeforeDate = function(date, userId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE watchDate < ? AND userId = ?'
            db.all(sql, [date.format(DATE_FORMAT), userId], (err, rows) => {
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
    this.getLastMonthSeenFilms = function(userId) {
        const today = dayjs().format(DATE_FORMAT)
        const lastMonth = dayjs().subtract(1, 'month').format(DATE_FORMAT)

        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE watchDate >= ? AND watchDate <= ? AND userId = ? ORDER BY watchDate DESC'
            db.all(sql, [lastMonth, today, userId], (err, rows) => {
                if(err) reject(err)
                else resolve(mapRowsToFilms(rows))
            })
        })
    }

    // Method to retrieve the most rated films (rating == 5)
    this.getMostRatedFilms = function(userId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE rating == 5 AND userId = ?'
            db.all(sql, [userId], (err, rows) => {
                if(err) reject(err)
                else resolve(mapRowsToFilms(rows))
            })
        })
    }

    // Method to return unseen films (watchDate IS NULL)
    this.getUnseenFilms = function(userId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE watchDate IS NULL AND userId = ?'
            db.all(sql, [userId], (err, rows) => {
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

    // Method to update the properties of an existing film
    this.updateFilm = function(id, title, isFavorite, rating, watchDate, userId) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE films SET
                            title = COALESCE(?, title),
                            isFavorite = COALESCE(?,isFavorite),
                            rating = COALESCE(?, rating),
                            watchDate = COALESCE(?, watchDate),
                            userId = COALESCE(?, userId)
                         WHERE id == ?`
            db.run(sql, [
                title ?? null,
                isFavorite ?? null,
                rating ?? null,
                watchDate ?? null,
                userId ?? null,
                id
            ], (err) => {
                if(err) reject(err)
                else resolve('Film successfully updated!')
            })
        })
    }

    // Method to return a user by its email and password from the database
    this.getUser = function(email, password) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM users WHERE email = ?"
            db.get(sql, [email], (err, row) => {
                if (err) {                      // DB error
                    reject(err)
                }
                else if (row === undefined) {   // Email not found
                    resolve(false)
                }
                else {                          // Email found -> check password
                    const user = {id: row.id, email: row.email, name: row.name}
                    crypto.scrypt(password, row.salt, 16, function(err, hashedPassword) {
                        if (err) reject(err)    // Error in hashing the password
                        if (!crypto.timingSafeEqual(Buffer.from(row.hash, "hex"), hashedPassword))
                            resolve(false)      // Wrong password
                        else
                            resolve(user)       // Correct password -> return user information
                    })
                }
            })
        })
        
    }
}

export{FilmLibrary}