import dayjs from 'dayjs';

function FilmLibrary(oldList = []) {
    this.list = [...oldList] // Copy the list to keep it immutable

    // Method to add a new film
    this.addFilm = function(film) {
        this.list.push(film)
        return this // returns the updated instance
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
export default FilmLibrary