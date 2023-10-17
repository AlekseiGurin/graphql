const  graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt } = graphql;

const movies = [
    {id: '1', name: "Pulp Fiction", genre: "crime"},
    {id: '2', name: "1986", genre: "crime"},
    {id: 3, name: "v for vendetta", genre: "triller"},
    {id: 4, name: "Snatch", genre: "comedy"}
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
        genre: { type: GraphQLInt },
    })
});

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLString },
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
    }
});

// экспартируем наш корневой запрос
module.exports = new GraphQLSchema({
    query: Query,
})
