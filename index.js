const express = require('express')
const crypto = require('crypto')
const app = express()

app.use(express.json())

let persons = [
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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request,response) => {
    const date = new Date()
    console.log(date)
    response.send(
        `<p> Phonebook has info for ${persons.length} people </p>
         <p> ${date} </p>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request,response) => {
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
        const duplicate = persons.some(person => person.name === request.body.name)
        if(duplicate){
            return response.status(400).json({error: 'Name already exists '})
        }
    }

    const id = crypto.randomBytes(16).toString("hex");
    const newPerson = {
        name: request.body.name,
        number: request.body.number,
        id: id
    }
    persons = persons.concat(newPerson)
    response.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
