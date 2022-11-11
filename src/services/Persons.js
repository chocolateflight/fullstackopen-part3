import axios from 'axios';
const baseUrl = 'http://localhost:3001/persons';

const getAll = () => {
  return axios.get(baseUrl);
};

const createPerson = (newPerson) => {
  return axios.post(baseUrl, newPerson);
};

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

const updatePerson = (id, changedNote) => {
  return axios.put(`${baseUrl}/${id}`, changedNote)
}

export { getAll, createPerson, deletePerson, updatePerson };
