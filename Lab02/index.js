import dayjs from 'dayjs'
import { FilmLibrary } from "./FilmLibrary.js"
import { Film } from './Film.js'

function printAll(films) {
    films.forEach((film) => {
        console.log(`${film}`)
    })
}

async function main() {
    const filmLibrary = new FilmLibrary()

    // 1.a get all films
    console.log("----- All Films -----")
    const films = await filmLibrary.getAllFilms()
    printAll(films)

    // 1.b get favorite films
    console.log("----- Favorite Films -----")
    const favFilms = await filmLibrary.getFavoriteFilms()
    printAll(favFilms)

    // 1.c get films before date
    const watchDate = dayjs('2026-03-25')
    console.log(`-----Films Before ${watchDate}`)
    const filmsBefore = await filmLibrary.getFilmsBeforeDate(watchDate)
    printAll(filmsBefore)

    // 1.d get film by title
    const title = 'war'
    console.log(`----- Films by Title containing the word ${title}`)
    const filmByTitle = await filmLibrary.getFilmByTitle(title)
    printAll(filmByTitle)

    // 2.a
    const newFilm = new Film(null, 'Interstellar', 1, '2026-03-19', 4, 1)
    filmLibrary.addNewFilm(newFilm)
    // 2.b

    // 2.c
}

main()