const  graphql = require('graphql');
const {GraphQLList} = require("graphql");

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID } = graphql;

const movies = [
    {id: '1', name: "Pulp Fiction", genre: "crime", directorId: '1'},
    {id: '2', name: "1986", genre: "crime", directorId: '2'},
    {id: 3, name: "v for vendetta", genre: "triller", directorId: '3'},
    {id: 4, name: "Snatch", genre: "comedy", directorId: '4'},
    {id: 5, name: "Reservoir Dogs", genre: "crime-comedy", directorId: '1'},
    {id: 6, name: "The Hateful Eight", genre: "crime", directorId: '1'},
    {id: 7, name: "Inglourious Basterds", genre: "crime", directorId: '1'},
    {id: 7, name: "Lock, Stock Two Smoking Barrels", genre: "crime-comedy", directorId: '4'},
]

const directors = [
    {id: "1", name: "Quentin Tarantino", age: 55},
    {id: "2", name: "Michael Radford", age: 72},
    {id: "3", name: "James McTeigue", age: 51},
    {id: "4", name: "Guy Ritchie", age: 50},
]
// описываем схему хронящихся в базе
const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        director: {
            type: DirectorType,
            resolve(parent, args) {
                return directors.find(director => director.id === args.id);
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
                return movies.filter(movie => movie.directorId === parent.id)
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
            return movies.find(movie => args.id === movie.id);
        },
      },
        director: {
            type: DirectorType,
            args: { id: { type: GraphQLID }},
        resolve(parent, args) {
            return directors.find(director => args.id === director.id);
        },
      },
        movies: {
            type: new GraphQLList(MovieType),
            resolve() {
                return movies;
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            resolve() {
                return directors;
            }
        }
    }
});

// экспартируем наш корневой запрос
module.exports = new GraphQLSchema({
    query: Query,
})
