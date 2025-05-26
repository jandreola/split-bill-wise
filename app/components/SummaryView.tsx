// app/components/SummaryView.tsx
'use client';

import React from 'react';
import { Balance, Transaction, Person } from '../lib/splitter';

interface SummaryViewProps {
  balances: Balance[];
  transactions: Transaction[];
  people: Person[];
}

const SummaryView: React.FC<SummaryViewProps> = ({ balances, transactions, people }) => {
  const getPersonName = (id: string) => {
    const person = people.find(p => p.id === id);
    return person ? person.name : 'Unknown';
  };

  return (
    <div className="card-ios p-0"> {/* Padding removed for edge-to-edge list sections */}
       <h2 className="text-xl font-semibold p-4 md:p-6 text-gray-800 border-b border-ios-mid-gray">Summary</h2>
      
      <div className="p-4 md:p-6">
        <h3 className="text-lg font-medium mb-2 text-gray-700">Balances:</h3>
        {balances.length === 0 ? (
          <p className="text-sm text-ios-dark-gray">No calculations yet.</p>
        ) : (
          <ul className="bg-white rounded-ios border border-ios-mid-gray divide-y divide-ios-mid-gray">
            {balances.map((balance) => (
              <li
                key={balance.personId}
                className={`p-3 text-sm flex justify-between items-center ${
                  balance.amount === 0 ? 'bg-opacity-50' : '' // Keep bg-white from ul, just adjust text
                }`}
              >
                <span className={`font-medium ${balance.amount === 0 ? 'text-ios-dark-gray' : balance.amount > 0 ? 'text-ios-green' : 'text-ios-red'}`}>
                    {balance.name || getPersonName(balance.personId)}
                </span>
                <span className={`font-semibold ${balance.amount === 0 ? 'text-ios-dark-gray' : balance.amount > 0 ? 'text-ios-green' : 'text-ios-red'}`}>
                  {balance.amount === 0
                    ? 'Settled'
                    : balance.amount > 0
                    ? `Is owed $${balance.amount.toFixed(2)}`
                    : `Owes $${(-balance.amount).toFixed(2)}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 md:p-6 border-t border-ios-mid-gray">
        <h3 className="text-lg font-medium mb-2 text-gray-700">Settlement Transactions:</h3>
        {transactions.length === 0 ? (
           balances.length > 0 && balances.every(b => Math.abs(b.amount) < 0.01) ?
            <p className="text-sm text-ios-green">All debts are settled!</p> :
            <p className="text-sm text-ios-dark-gray">No transactions needed or calculated yet.</p>
        ) : (
          <ul className="bg-white rounded-ios border border-ios-mid-gray divide-y divide-ios-mid-gray">
            {transactions.map((transaction, index) => (
              <li key={index} className="p-3 text-sm hover:bg-ios-light-gray transition-colors">
                <span className="font-medium text-gray-700">{transaction.fromName || getPersonName(transaction.fromId)}</span>
                {' owes '}
                <span className="font-medium text-gray-700">{transaction.toName || getPersonName(transaction.toId)}</span>
                {' : '}
                <span className="font-bold text-ios-blue">${transaction.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SummaryView;
