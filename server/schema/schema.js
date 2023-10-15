const  graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

// описываем схему хронящихся в базе
const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
    })
});


// создаем и описываем корневой запрос
const Query = new GraphQLObjectType({
    name: 'Query',
    // подзапрос movie
    fields: { movie: {
        type: MovieType,
        args: { id: { type: GraphQLString }},
        resolve(parent, args) {

        }
    }
}})

// экспартируем наш корневой запрос
module.exports = new GraphQLSchema({
    query: Query,
})
