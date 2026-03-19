import sqlite from 'sqlite3'
import { Film } from './Film.js'

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
            db.all(sql, [date.format('YYYY-MM-DD')], (err, rows) => {
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

}

export{FilmLibrary}