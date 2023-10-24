const mongoose = require("mongoose");
const Scheme = mongoose.Schema;

const directorScheme = new Scheme({
    name: String,
    age: Number
})

module.exports = mongoose.model('Director', directorScheme)
