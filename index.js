const express = require('express');
const app = express();

app.use(express.json());

let data = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

// GET

app.get('/', (request, response) => {
  response.send('Hello World');
});

app.get('/api/v1/persons', (request, response) => {
  response.json(data);
});

app.get('/api/v1/persons/:id', (request, response) => {
  const id = +request.params.id;
  const person = data.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${data.length} people</p><p>${new Date()}</p>`
  );
});

// POST

app.post('/api/v1/persons', (request, response) => {
  const body = request.body;
  console.log(body);

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing',
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing',
    });
  }

  if (data.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: 'name is already in the phonebook',
    });
  }

  const person = {
    id: Math.random() * (100000 - 1) + 1,
    name: body.name,
    number: body.number,
  };

  data = data.concat(person);
  response.json(person);
});

// DELETE

app.delete('/api/v1/persons/:id', (request, response) => {
  const id = +request.params.id;
  data = data.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
