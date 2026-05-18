import dayjs from 'dayjs'; // Import dayjs library

// Constructor function to create Film objects
function Film(id, title, favourite=false, watchDate=null, rating=null, userId=1) {
    this.id = id
    this.title = title
    this.favorite = favourite
    this.watchDate = watchDate ? dayjs(watchDate) : null
    this.rating = rating
    this.userId =  userId
}
export default Film