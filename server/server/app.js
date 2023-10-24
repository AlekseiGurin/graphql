const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('../schema/schema');
const  mongoose = require('mongoose')

const app = express();
const PORT = 3005;
const mongoConnectionString = 'mongodb+srv://Gurini:OpBtoIOJGwrT8Tbs@graphqltutorial.l2yaiof.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(mongoConnectionString, {useNewUrlParser: true, useUnifiedTopology: true});

const dbConnection = mongoose.connection;
dbConnection.on('error', err => console.log(`Connection error: ${err}`));
dbConnection.once('open', () => console.log('Connection to DB!!'));
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));
`useMongoClient`
app.listen(PORT, err => {
  err ? console.log(err) : console.log('Server started!');
});
