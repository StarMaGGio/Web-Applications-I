# Film library API Documentation
## Retrieve the list of all the stored films
**GET** `http://localhost:3000/api/v1/films`

Return the list of all the films stored in the database

**Sample Request**

`GET http://localhost:3000/api/v1/films`

**Sample Response**

`HTTP/1.1 200 OK`
```json
[
  {
    "id": 1,
    "title": "Pulp Fiction",
    "favorite": 1,
    "watchDate": "2026-03-10",
    "rating": 3,
    "userId": 1
  },
  {
    "id": 2,
    "title": "21 Grams",
    "favorite": 1,
    "watchDate": "2026-03-17",
    "rating": 4,
    "userId": 1
  }
]
```
**Error Response**

`HTTP/1.1 500 Internal Server Error`

## Retrieve the list of all the favorite films
**GET** `http://localhost:3000/api/v1/films`

Return the list of all the films with the parameter `isFavorite == 1`

**Sample Request**

`GET http://localhost:3000/api/v1/films/favorites`

**Sample Response**

`HTTP/1.1 200 OK`
```json
[
  {
    "id": 1,
    "title": "Pulp Fiction",
    "favorite": 1,
    "watchDate": "2026-03-10",
    "rating": 3,
    "userId": 1
  },
  {
    "id": 2,
    "title": "21 Grams",
    "favorite": 1,
    "watchDate": "2026-03-17",
    "rating": 4,
    "userId": 1
  }
]
```

**Error Response**

`HTTP/1.1 500 Internal Server Error`

## Retrieve the list of the most rated films

**GET** `http://localhost:3000/api/v1/films/most-rated`

Return the list of all the films with the parameter `rating == 5`

**Sample Request**

`GET http://localhost:3000/api/v1/films/most-rated`

**Sample Response**

`HTTP/1.1 200 OK`
```json
[
  {
    "id": 7,
    "title": "Avengers: End Game",
    "favorite": 1,
    "watchDate": "2026-01-11",
    "rating": 5,
    "userId": 1
  }
]
```

**Error Response**

`HTTP/1.1 500 Internal Server Error`

## Retrieve the list of the recent seen films

**GET** `http://localhost:3000/api/v1/films/recent-seen`

Return the list of the films whose `watchDate` parameter is in the last month

**Sample Request**

`GET http://localhost:3000/api/v1/films/recent-seen`

**Sample Response**
`HTTP/1.1 200 OK`
```json
[
  {
    "id": 5,
    "title": "Shrek",
    "favorite": 0,
    "watchDate": "2026-03-21",
    "rating": 3,
    "userId": 2
  },
  {
    "id": 2,
    "title": "21 Grams",
    "favorite": 1,
    "watchDate": "2026-03-17",
    "rating": 4,
    "userId": 1
  }
]
```

**Error Response**

`HTTP/1.1 500 Internal Server Error`

## Retrieve the list of the unseen films
**GET** `http://localhost:3000/api/v1/films/unseen`

Return the list of all the films with the parameter `watchDate == NULL`

**Sample Request**

`GET http://localhost:3000/api/v1/films/unseen`

**Sample Response**

`HTTP/1.1 200 OK`
```json
[
  {
    "id": 3,
    "title": "Star Wars",
    "favorite": 0,
    "watchDate": null,
    "rating": null,
    "userId": 1
  },
  {
    "id": 4,
    "title": "Matrix",
    "favorite": 0,
    "watchDate": null,
    "rating": null,
    "userId": 2
  }
]
```

**Error Response**

`HTTP/1.1 500 Internal Server Error`

## Retrieve a specific film
**GET** `http://localhost:3000/api/v1/films/:id`

Return the film identified by the `id` passed as parameter

**Sample Request**

`GET http://localhost:3000/api/v1/films/1`

**Sample Response**

`HTTP/1.1 200 OK`
```json
[
  {
    "id": 1,
    "title": "Pulp Fiction",
    "favorite": 1,
    "watchDate": "2026-03-10",
    "rating": 3,
    "userId": 1
  }
]
```

**Error Response**

`HTTP/1.1 500 Internal Server Error`

*or* 

`HTTP/1.1 400 Bad Request`

## Add a new film to the film library
**POST** `http://localhost:3000/api/v1/films/new-film`

Create a new film, by providing all its properties, except the id that will be automatically assigned by the back-end

**Sample Request**

`POST http://localhost:3000/api/v1/films/new-film`
```json
{
    "title": "Bee Movie",
    "favorite": 0,
    "watchDate": "2026-02-20",
    "rating": 3
}
```

**Sample Response**

`HTTP/1.1 201 Created`
```json
{
  "id": 9
}
```

**Error Response**

`HTTP/1.1 500 Internal Server Error`

*or*

`HTTP/1.1 400 Bad Request`

## Update an existing film, by providing all its updated properties
**POST** `http://localhost:3000/api/v1/films/update-film`

Update a stored film properties with the values passed as parameters

**Sample Request**

`POST http://localhost:3000/api/v1/films/update-film`
```json
{
    "id": 7,
    "title": "Avengers: End Game",
    "favorite": 1,
    "watchDate": "2026-01-12",
    "userId": 1
}
```

**Sample Response**

`HTTP/1.1 200 OK`
```json
"Film successfully updated!"
```

**Error Response**

`HTTP/1.1 500 Internal Server Error`

*or*

`HTTP/1.1 400 Bad Request`


## Update the rating of a specific film
**POST** `http://localhost:3000/api/v1/films/update-film-rating`

Update the parameter `rating` of the film identified by the `id` passed as parameter with the value passed as second parameter

**Sample Request**

`POST http://localhost:3000/api/v1/films/update-film-rating`
```json
{
    "id": 1,
    "rating": 3
}
```

**Sample Response**

`HTTP/1.1 200 OK`
```json
"Film successfully updated!"
```

**Error Response**

`HTTP/1.1 500 Internal Server Error`

*or*

`HTTP/1.1 400 Bad Request`

## Mark an existing film as favorite/unfavorite
**POST** `http://localhost:3000/api/v1/films/change-favorite`

Update the `isFavorite` parameter if the film identified by the `id` passed as parameter with the value passed as parameter

**Sample Request**

`POST http://localhost:3000/api/v1/films/change-favorite`
```json
{
    "id": 1,
    "favorite": 1
}
```

**Sample Response**

`HTTP/1.1 200 OK`
```json
"Film successfully updated!"
```

**Error Response**

`HTTP/1.1 500 Internal Server Error`

*or*

`HTTP/1.1 400 Bad Request`

## Delete an existing film given its id
**DELETE** `http://localhost:3000/api/v1/films/:id`

Delete from the database the film identified by the `id` passed as parameter

**Sample Request**

`DELETE http://localhost:3000/api/v1/films/9`

**Sample Response**

`HTTP/1.1 200 OK`
```json
"Film successfully deleted from the Database!"
```

**Error Response**

`HTTP/1.1 500 Internal Server Error`

*or*

`HTTP/1.1 400 Bad Request`