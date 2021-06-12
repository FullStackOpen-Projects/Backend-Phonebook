require('dotenv').config({path: './.env'})
const express = require('express')
const crypto = require('crypto')
const cors = require('cors')
const app = express()
const Contact = require('./models/contact')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

app.get('/api/contacts', (request, response) => {
    Contact.find({}).then(contacts => response.json(contacts))
})

app.get('/info', (request,response) => {
    const date = new Date()
    console.log(date)
    response.send(
        `<p> Phonebook has info for ${contacs.length} people </p>
         <p> ${date} </p>`
    )
})

app.get('/api/contacts/:id', (request, response) => {
    const id = request.params.id
    Contact.findById(id)
    .then(contact => {
        if(contact){
            response.json(contact)
        }
        else{
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/contacts/:id', (request, response, next) => {
    const id = request.params.id
    Contact.findByIdAndRemove(id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/contacts/:id', (request, response, next) => {
    const newContact = {
        name: request.body.name,
        number: request.body.number,
    }

    Contact.findByIdAndUpdate(request.params.id, newContact, {new: true})
    .then(updatedNote => {
        response.json(updatedNote)
    })
    .catch(error => next(error))
})

app.post('/api/contacts', (request,response, next) => {
    if(!(request.body.name)){
        return response.status(400).json({error: 'Name is missing'})
    }
    else if(!(request.body.number)){
        return response.status(400).json({error: 'Number is missing'})
    }
    else if(!(request.body.name) && !(request.body.number)){
        return response.status(400).json({error: 'Name and number are missing'})
    }

    const id = crypto.randomBytes(16).toString("hex");

    const newContact = new Contact({
        name: request.body.name,
        number: request.body.number,
        id: id
    })

    newContact.save()
    .then(savedContacts => {
        response.json(savedContacts)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    if(error.name === 'CastError'){
        response.status(400).send({error: 'Malformatted id'})
    }
    else if(error.name === 'ValidationError'){
        response.status(400).json({error: error.message})
    }
}
app.use(errorHandler)

const PORT = Number(process.env.PORT || 3001)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
