const express = require('express')
const crypto = require('crypto')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

let contacts = [
    { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
    },
    { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
    },
    { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
    },
    { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/api/contacts', (request, response) => {
    response.json(contacts)
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
    const id = Number(request.params.id)
    const contact = contacts.find(contact => contact.id === id)
    
    if(contact){
        response.json(contact)
    }
    else{
        response.status(404).end()
    }
})

app.delete('/api/contacts/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/contacts', (request,response) => {
    if(!(request.body.name)){
        return response.status(400).json({error: 'Name is missing'})
    }
    else if(!(request.body.number)){
        return response.status(400).json({error: 'Number is missing'})
    }
    else if(!(request.body.name) && !(request.body.number)){
        return response.status(400).json({error: 'Name and number are missing'})
    }
    else{
        const duplicate = contacts.some(contact => contact.name === request.body.name)
        if(duplicate){
            return response.status(400).json({error: 'Name already exists '})
        }
    }

    const id = crypto.randomBytes(16).toString("hex");
    const newContact = {
        name: request.body.name,
        number: request.body.number,
        id: id
    }
    contacts = contacts.concat(newContact)
    response.json(newContact)
})

/*
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
app.use(morgan('tiny', {stream: accessLogStream}))
app.get('/', (request, response) => {
    response.send('Hello World')
})
*/

const PORT = Number(process.env.PORT || 3001)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
