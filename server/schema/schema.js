const  graphql = require('graphql');
const {GraphQLList} = require("graphql");

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID } = graphql;
//экземпляры монгус схемы
const Movies = require('../models/movies');
const Directors = require('../models/directors');

const directorsJson = [
    {"name": "Quentin Tarantino", "age": 55}, // 653297fd41b807f5b0691370
    {"name": "Michael Radford", "age": 72}, // 65329e4f41b807f5b0691373
    {"name": "James McTeigue", "age": 51}, // 65329ed141b807f5b0691374
    {"name": "Guy Ritchie", "age": 50}, // 65329f2f41b807f5b0691375
]

const moviesJson = [
    {"name": "Pulp Fiction", "genre": "crime", "directorId": "653297fd41b807f5b0691370"},
    {"name": "1986", "genre": "crime", "directorId": "65329e4f41b807f5b0691373"},
    {"name": "Snatch", "genre": "comedy", "directorId": "65329ed141b807f5b0691374"},
    {"name": "Reservoir Dogs", "genre": "crime-comedy", "directorId": "65329f2f41b807f5b0691375"},
    {"name": "The Hateful Eight", "genre": "crime", "directorId": "653297fd41b807f5b0691370"},
    {"name": "Inglourious Basterds", "genre": "crime", "directorId": "653297fd41b807f5b0691370"},
    {"name": "Lock, Stock Two Smoking Barrels", "genre": "crime-comedy", "directorId": "65329f2f41b807f5b0691375"},
]

// const movies = [
//     {id: '1', name: "Pulp Fiction", genre: "crime", directorId: '1'},
//     {id: '2', name: "1986", genre: "crime", directorId: '2'},
//     {id: 3, name: "v for vendetta", genre: "triller", directorId: '3'},
//     {id: 4, name: "Snatch", genre: "comedy", directorId: '4'},
//     {id: 5, name: "Reservoir Dogs", genre: "crime-comedy", directorId: '1'},
//     {id: 6, name: "The Hateful Eight", genre: "crime", directorId: '1'},
//     {id: 7, name: "Inglourious Basterds", genre: "crime", directorId: '1'},
//     {id: 7, name: "Lock, Stock Two Smoking Barrels", genre: "crime-comedy", directorId: '4'},
// ]

// const directors = [
//     {id: "1", name: "Quentin Tarantino", age: 55},
//     {id: "2", name: "Michael Radford", age: 72},
//     {id: "3", name: "James McTeigue", age: 51},
//     {id: "4", name: "Guy Ritchie", age: 50},
// ]
// описываем схему фильмов хронящихся в базе
const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        director: {
            type: DirectorType,
            resolve(parent, args) {
                //return directors.find(director => director.id === args.id);
                return Directors.findById(parent.directorId)
            }
        }
    })
});

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLString },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent) {
                //return movies.filter(movie => movie.directorId === parent.id)
                return Movies.find({ directorId: parent.id })
            }
        }
    })
});

// создаем и описываем корневой запрос
const Query = new GraphQLObjectType({
    name: 'Query',
    // подзапрос movie
    fields: {
        movie: {
        type: MovieType,
        args: { id: { type: GraphQLID }},
        // resolve - метод для манипуляции базой данных
        resolve(parent, args) {
            //return movies.find(movie => args.id === movie.id);
            return Movies.findById(args.id)
        },
      },
        director: {
            type: DirectorType,
            args: { id: { type: GraphQLID }},
        resolve(parent, args) {
            //return directors.find(director => args.id === director.id);
            return Directors.findById(args.id)
        },
      },
        movies: {
            type: new GraphQLList(MovieType),
            resolve() {
                //return movies;
                console.log("")
                return Movies.find({})
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            resolve() {
                ///return directors;
                return Movies.find({})
            }
        }
    }
});

// экспартируем наш корневой запрос
module.exports = new GraphQLSchema({
    query: Query,
})
