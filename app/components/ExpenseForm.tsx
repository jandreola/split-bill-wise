// app/components/ExpenseForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Person, Expense } from '../lib/splitter';

interface ExpenseFormProps {
  people: Person[];
  onAddExpense: (expenseData: Omit<Expense, 'id'>) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ people, onAddExpense }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [paidById, setPaidById] = useState<string>('');
  const [participantIds, setParticipantIds] = useState<string[]>([]);

  useEffect(() => {
    if (people.length > 0 && paidById === '') {
      setPaidById(people[0].id);
    }
    if (people.length === 0) {
      setPaidById(''); // Clear payer if no people
    }
  }, [people, paidById]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || !paidById || participantIds.length === 0) {
      alert('Please fill in all fields and select participants.');
      return;
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }

    onAddExpense({
      description: description.trim(),
      amount: numericAmount,
      paidById,
      participantIds,
    });

    setDescription('');
    setAmount('');
    // setPaidById(''); // Keep payer selected or reset based on preference
    setParticipantIds([]);
  };

  const handleParticipantChange = (personId: string) => {
    setParticipantIds((prev) =>
      prev.includes(personId)
        ? prev.filter((id) => id !== personId)
        : [...prev, personId]
    );
  };

  return (
    <div className="card-ios p-4 md:p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-700">
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Dinner, Groceries"
            className="input-ios"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-1 text-gray-700">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="input-ios"
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="paidBy" className="block text-sm font-medium mb-1 text-gray-700">
            Paid By
          </label>
          <select
            id="paidBy"
            value={paidById}
            onChange={(e) => setPaidById(e.target.value)}
            className="select-ios"
            disabled={people.length === 0}
          >
            <option value="" disabled>
              {people.length === 0 ? 'Add people first' : 'Select Payer'}
            </option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Participants</label>
          {people.length === 0 ? (
             <p className="text-sm text-ios-dark-gray">Add people first to select participants.</p>
          ) : (
            <div className="space-y-2 rounded-ios border border-ios-mid-gray p-3 bg-white">
              {people.map((person) => (
                <label key={person.id} className="flex items-center space-x-3 p-1">
                  <input
                    type="checkbox"
                    checked={participantIds.includes(person.id)}
                    onChange={() => handleParticipantChange(person.id)}
                    className="h-5 w-5 rounded-full text-ios-blue border-ios-mid-gray focus:ring-ios-blue" // Styled checkbox
                  />
                  <span className="text-sm text-gray-700">{person.name}</span>
                </label>
              ))}
            </div>
          )}
           {people.length > 0 && participantIds.length === 0 && (
            <p className="text-xs text-ios-red mt-1">Please select at least one participant.</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full btn-ios bg-ios-green hover:bg-opacity-80 disabled:bg-ios-mid-gray disabled:text-ios-dark-gray"
          disabled={people.length === 0 || !paidById}
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};
export default ExpenseForm;
