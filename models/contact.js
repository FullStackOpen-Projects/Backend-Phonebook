const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
//const url = process.env.MONGODB_URI

//console.log('Connecting to', url)

mongoose.connect("mongodb+srv://Steven:StevenHans@cluster0.s52wk.mongodb.net/Phonebook?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
.then(result => {
    console.log('Connected to MongoDB')
})
.catch(error => {
    console.log('Error connecting to MongoDB: ', error.message)
})

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minLength: 3
    },
    number:{
        type: String,
        required: true,
        minLength: 8
    },
    id: String
})
contactSchema.plugin(uniqueValidator)

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)

