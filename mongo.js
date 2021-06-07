const mongoose = require('mongoose')
const crypto = require('crypto')

if(process.env.length < 3){
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]
const contactName = process.argv[3]
const contactNumber = process.argv[4]
const url = `mongodb+srv://Steven:${password}@cluster0.s52wk.mongodb.net/Phonebook?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: String
})

const contactId = crypto.randomBytes(16).toString("hex");
const Contact = mongoose.model('Contact', contactSchema)

if(!(contactName) && !(contactNumber)){
    Contact.find({}).then(result => {
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`)
        })
        mongoose.connection.close()
    })
    return
}

const contact = new Contact({
    name: contactName,
    number: contactNumber,
    id: contactId
})

contact.save().then(result => {
    console.log(`added ${contactName} number ${contactNumber} to phonebook`)
    mongoose.connection.close()
})
