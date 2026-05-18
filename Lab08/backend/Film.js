import dayjs from 'dayjs'

const DATE_FORMAT = 'YYYY-MM-DD'

function Film(id, title, favorite=false, watchDate=null, rating=null, userId=1) {
    this.id = id
    this.title = title
    this.favorite = favorite
    this.watchDate = watchDate ? dayjs(watchDate).format(DATE_FORMAT) : null
    this.rating = rating
    this.userId =  userId

    this.toString = () => {
        const watchDate = this.watchDate ? this.watchDate.format('DD/MM/YYYY') : null

        return `Id: ${this.id}, ` +
            `Title: ${this.title}, Favorite: ${this.favorite}, ` +
            `Watch date: ${watchDate}, Score: ${this.rating}, ` +
            `User: ${this.userId}`;
    }
}

export{Film}