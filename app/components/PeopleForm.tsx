// app/components/PeopleForm.tsx
'use client';

import React, { useState } from 'react';
import { Person } from '../lib/splitter';

interface PeopleFormProps {
  people: Person[];
  onAddPerson: (name: string) => void;
}

const PeopleForm: React.FC<PeopleFormProps> = ({ people, onAddPerson }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddPerson(name.trim());
      setName('');
    }
  };

  return (
    <div className="card-ios p-4 md:p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Add People</h2>
      <form onSubmit={handleSubmit} className="flex gap-3 items-center mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter person's name"
          className="input-ios flex-grow"
        />
        <button type="submit" className="btn-ios whitespace-nowrap">
          Add Person
        </button>
      </form>
      <h3 className="text-lg font-medium mb-2 text-gray-700">Participants:</h3>
      {people.length === 0 ? (
        <p className="text-sm text-ios-dark-gray">No people added yet.</p>
      ) : (
        <ul className="bg-white rounded-ios border border-ios-mid-gray">
          {people.map((person, index) => (
            <li key={person.id} className={`p-3 text-sm ${index > 0 ? 'list-item-ios' : ''}`}>
              {person.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PeopleForm;
