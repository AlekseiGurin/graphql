const  graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList, GraphQLInt, GraphQLNonNull, GraphQLBoolean } = graphql;

//экземпляры монгус схемы
const Movies = require('../models/movies');
const Directors = require('../models/directors');

// описываем схему фильмов хронящихся в базе
const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        rate: { type: GraphQLString },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) },
        directorId: {
            type: DirectorType,
            resolve({ directorId }, args) {
                //return directors.find(director => director.id === args.id);
                return Directors.findById(directorId)
            }
        }
    })
});

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        movies: {
            type: new GraphQLList(MovieType),
            resolve({ id }) {
                //return movies.filter(movie => movie.directorId === parent.id)
                return Movies.find({ directorId: id })
            }
        }
    })
});

// создаем и описываем корневую мутацию
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: DirectorType,
            args: {
                name: {  type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, { name, age }) {
              const director = new Directors({
                  name,
                  age,
              });
              // сохроняем директора в базу с помощью метода  mongoose - save()
              return director.save();
            }
        },
        addMovie: {
            type: MovieType,
            args: {
                name: {  type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                watched: { type: new GraphQLNonNull(GraphQLBoolean) },
                rate: { type: GraphQLString },
                directorId: {type: GraphQLID},

            },
            resolve(parent,{ name, genre, directorId, watched, rate }) {
                const movie = new Movies({
                    name,
                    genre,
                    directorId,
                    watched,
                    rate,

                });
                // сохроняем директора в базу с помощью метода  mongoose - save()
                return movie.save();
            }
        },
        deleteDirector: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, { id }) {
                return Directors.findByIdAndRemove(id, (err, docs) => {
                    if (err){
                        console.log(err)
                    }
                    else{
                        console.log("Removed Director : ", docs);
                    }
                })
            }
        },
        deleteMovie: {
            type: MovieType,
            args: {id: {type: GraphQLID}},
            resolve(parent, { id }) {
                return Movies.findByIdAndRemove(id, (err, docs) => {
                    if (err){
                        console.log(err)
                    }
                    else{
                        console.log("Removed Movie : ", docs);
                    }
                })
            }
        },
        updateDirector: {
            type: DirectorType,
            args: {
                id: {type: GraphQLID},
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, { id, name, age}) {
                return Directors.findByIdAndUpdate(
                    id,
                    { $set: { name, age } },
                    { new: true }
                )
            }
        },
        updateMovie: {
            type: MovieType,
            args: {
                id: {type: GraphQLID},
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                rate: {type: new GraphQLNonNull(GraphQLString)},
                watched: {type: GraphQLBoolean},
                directorId: {type: GraphQLID},
            },
            resolve(parent, { id, name, genre, directorId, watched, rate  }) {
                return Movies.findByIdAndUpdate(
                    id,
                    { $set: { name, genre, directorId, watched, rate } },
                    { new: true }
                )
            }
        },
    }
})

// создаем и описываем корневой запрос
const Query = new GraphQLObjectType({
    name: 'Query',
    // подзапрос movie
    fields: {
        movie: {
        type: MovieType,
        args: { id: { type: GraphQLID }},
        // resolve - метод для манипуляции базой данных
        resolve(parent, { id }) {
            //return movies.find(movie => args.id === movie.id);
            return Movies.findById(id)
        },
      },
        director: {
            type: DirectorType,
            args: { id: { type: GraphQLID }},
        resolve(parent, { id }) {
            //return directors.find(director => args.id === director.id);
            return Directors.findById(id)
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
    mutation: Mutation
})
