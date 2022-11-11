import React from 'react';

const Persons = (props) => {
  const clickDeleteHandler = (event) => {
    event.preventDefault();
    props.onDeletePerson(event.target.id);
  };

  return (
    <>
      {props.persons
        .filter((person) =>
          person.name.toUpperCase().includes(props.filter.toUpperCase())
        )
        .map((person) => (
          <div key={person.id}>
            <span name={person.name} number={person.number}>
              {' '}
              {person.name}: {person.number}
            </span>
            <button id={person.id} onClick={clickDeleteHandler}>
              delete
            </button>
          </div>
        ))}
    </>
  );
};

export default Persons;
