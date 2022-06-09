const express = require('express')
const app = express()
const morgan = require('morgan')

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

morgan.token('person', (req, res) => JSON.stringify(req.body))

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person', {
  skip: function (req, res) {
    return req.method !== 'POST'
  }
}))


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})


app.get('/api/persons', (req, res) => {
  res.json(persons)
})


app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people.</p><p>${new Date()}</p>`)
})


app.get('/api/persons/:id', (req, res) => {
  const id = +req.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})


app.delete('/api/persons/:id', (req, res) => {
  const id = +req.params.id
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})


app.post('/api/persons', (req, res) => {
  const body = req.body
  const matchName = (name) => body.name == name ? true : false
  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(person => person.id))
      : 0
    return maxId + 1
  }  

  if (!body.name || !body.number) {
    return res.status(400).json({ 
      error: 'required info missing' 
    })
  } else if (matchName(...persons)) {
    return res.status(400).json({ 
      error: 'name must be unique' 
    })
  } else {
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    }
  
    persons = persons.concat(person)
  
    res.json(person)  
  }
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})