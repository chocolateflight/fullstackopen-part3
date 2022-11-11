import { useEffect, useState } from 'react';
import { getAll, createPerson, deletePerson, updatePerson } from './services/Persons';
import Notification from './components/Notification';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
  // STATES
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState({
    message: null,
    error: null,
  });

  // LOADS INITIAL SET OF DATA
  useEffect(() => {
    getAll().then((response) => {
      const data = response.data;
      setPersons(data);
    });
  }, []);

  // ADD NAME TO SERVER AND STATE
  const addName = (event) => {
    event.preventDefault();

    const nameObject = {
      name: newName,
      number: newNumber,
    };

    const filteredPerson = persons.filter((person) => person.name === newName);
    if (filteredPerson.length > 0) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook. Do you want to update the number?`
        )
      ) {
        updateNumber(filteredPerson[0].id, nameObject);
        setNotification({ message: 'Phone Number has been updated.', error: 'success' });
        setNewName('');
        setNewNumber('');
        return;
      }
      return;
    }

    createPerson(nameObject).then((response) => {
      setPersons(persons.concat(response.data));
      setNotification({ message: `Added ${newName}`, error: 'success' });
      setNewName('');
      setNewNumber('');
    });
  };

  // DELETE PERSON FROM SERVER AND STATE
  const deleteName = (deleteId) => {
    const filter = persons.filter((person) => person.id === +deleteId)[0];
    const index = persons.indexOf(filter);
    if (window.confirm(`Do you really want to delete ${filter.name}?`)) {
      deletePerson(deleteId)
        .then(setPersons([...persons.slice(0, index), ...persons.slice(index + 1)]))
        .then(
          setNotification({
            message: `${filter.name} was successfully removed from the server`,
            error: 'success',
          })
        )
        .catch((error) => {
          setNotification({
            message: `The information of ${filter.name} was already removed from the server`,
            error: 'error',
          });
        });
    }
  };

  // UPDATE PHONE NUMBER
  const updateNumber = (id, nameObject) => {
    updatePerson(id, nameObject).then((response) => {
      setPersons(persons.map((person) => (person.id !== id ? person : response.data)));
    });
  };

  // EVENT HANDLERS
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter value={filter} onChange={handleFilter} />
      <h2>add a new</h2>
      <PersonForm
        onSubmit={addName}
        name={newName}
        onChangeName={handleNameChange}
        number={newNumber}
        onChangeNumber={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} onDeletePerson={deleteName} />
    </div>
  );
};

export default App;
