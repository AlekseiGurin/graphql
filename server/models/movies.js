const mongoose = require("mongoose");
const Scheme = mongoose.Schema;

const moviesScheme = new Scheme({
    name: String,
    genre: String,
    directorId: String,
    rate: Number,
    watched: Boolean
})

module.exports = mongoose.model('Movie', moviesScheme)
