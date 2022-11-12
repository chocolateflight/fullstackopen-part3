require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

/* -------------------------------------------------------------------------- */

const app = express();
app.use(express.static('build'));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());

morgan.token('body', (req) => {
  JSON.stringify(req.body);
});

/* -------------------------------------------------------------------------- */

// GET

app.get('/', (request, response) => {
  response.send('Hello World');
});

app.get('/info', (request, response) => {
  Person.find({}).then((persons) => {
    response.send(`Phonebook has info for ${persons.length} people <br> ${new Date()}`);
  });
});

app.get('/api/v1/persons', (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
});

app.get('/api/v1/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

/* -------------------------------------------------------------------------- */

// POST

app.post('/api/v1/persons', (request, response, next) => {
  const body = request.body;

  const person = new Person({
    _id: Math.floor(Math.random() * (100000 - 1) + 1),
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

/* -------------------------------------------------------------------------- */

// PUT
app.put('/api/v1/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

/* -------------------------------------------------------------------------- */

// DELETE

app.delete('/api/v1/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

/* -------------------------------------------------------------------------- */

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

/* -------------------------------------------------------------------------- */

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
