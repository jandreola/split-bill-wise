// app/components/ExpensesList.tsx
'use client';

import React from 'react';
import { Expense, Person } from '../lib/splitter';

interface ExpensesListProps {
  expenses: Expense[];
  people: Person[];
}

const ExpensesList: React.FC<ExpensesListProps> = ({ expenses, people }) => {
  const getPersonName = (id: string) => {
    const person = people.find(p => p.id === id);
    return person ? person.name : 'Unknown';
  };

  return (
    <div className="card-ios p-0"> {/* Padding removed to allow list to go edge-to-edge */}
      <h2 className="text-xl font-semibold p-4 md:p-6 text-gray-800 border-b border-ios-mid-gray">Expenses</h2>
      {expenses.length === 0 ? (
        <p className="text-sm text-ios-dark-gray p-4 md:p-6">No expenses added yet.</p>
      ) : (
        <ul className="divide-y divide-ios-mid-gray"> {/* Using divide for simpler separators */}
          {expenses.map((expense) => (
            <li key={expense.id} className="p-4 md:p-6 hover:bg-ios-light-gray transition-colors">
              <div className="flex justify-between items-center">
                <span className="font-medium text-md text-gray-800">{expense.description}</span>
                <span className="font-semibold text-lg text-gray-900">${expense.amount.toFixed(2)}</span>
              </div>
              <div className="text-sm text-ios-dark-gray mt-1">
                Paid by: <span className="font-medium text-gray-700">{getPersonName(expense.paidById)}</span>
              </div>
              <div className="text-sm text-ios-dark-gray">
                Participants: <span className="font-medium text-gray-700">
                  {expense.participantIds.map(id => getPersonName(id)).join(', ')}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpensesList;
