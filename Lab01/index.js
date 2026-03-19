import dayjs from 'dayjs'; // Import dayjs library

// Constructor function to create Film objects
function Film(id, title, favourite=false, watchDate=null, rating=null, userId=1) {
    this.id = id
    this.title = title
    this.favourite = favourite
    this.watchDate = watchDate ? dayjs(watchDate) : null
    this.rating = rating
    this.userId =  userId
}

// Constructor function to create FilmLibrary objects
function FilmLibrary() {
    this.list = [] // Films collection

    // Method to add a new film
    this.addFilm = function(film) {
        this.list.push(film)
    }

    // Method to return the formatted list of films
    this.getFormattedFilms = function() {
        return this.list.map(film => {
            const dateStr = film.watchDate ? film.watchDate.format('MMMM D, YYYY') : null
            return `Id: ${film.id}, Title: ${film.title}, Favourite: ${film.favourite}, Watch date: ${dateStr}, Rating ${film.rating}, User id: ${film.userId}`
        }).reduce((result, str) => result + "\n" + str, "")
    }

    // Method to sort films by ascending date (null watchDates at the end)
    this.sortByDate = function() {
        this.list.sort((a, b) => {
            // Handle null watchDates -> put at the end
            if (!a.watchDate && !b.watchDate) return 0 // like as thay have the same watchDate
            if (!a.watchDate) return 1 // a.watchDate "bigger" than b.watchDate
            if (!b.watchDate) return -1 // b.watchDate "bigger" than a.watchDate

            return a.watchDate.diff(b.watchDate) // ascending order with dayjs
        })

        return this
    }

    // Method to sort films by decreasing rating (null ratings at the end)
    this.sortByRating = function() {
        this.list.sort((a, b) => {
            if (!a.rating && !b.rating) return 0
            if (!a.rating) return 1
            if (!b.rating) return -1

            return b.rating - a.rating
        })

        return this
    }

    // Method to remove a Film
    this.removeFilm = function(id) {
        this.list = this.list.filter(film => film.id !== id) // Keep only films whose id is different form the passed one
    }

    // Method to update a film rating by his id
    this.updateRating = function(id, newRating) {
        const filmToUpdate = this.list.find(film => film.id === id)

        if (filmToUpdate) {
            if (newRating >= 1 && newRating <= 5) {
                filmToUpdate.rating = newRating
            } else {
                console.log("Errore: rating value is not valid")
            }
        } else console.log("Errore: film not found")
    }

}

// Create and populate the FilmLibrary
const filmLibrary = new FilmLibrary()
filmLibrary.addFilm(new Film(1, "Pulp Fiction", true, "2025-3-10", 5))
filmLibrary.addFilm(new Film(2, "21 Grams", true, "2025-3-17", 4))
filmLibrary.addFilm(new Film(3, "Star Wars"))
filmLibrary.addFilm(new Film(4, "Matrix"))
filmLibrary.addFilm(new Film(5, "Shrek", false, "2025-3-21", 3))

filmLibrary.updateRating(6, 1)

// Print Films
console.log(filmLibrary.getFormattedFilms())