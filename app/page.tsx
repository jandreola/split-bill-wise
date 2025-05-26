// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
// Head is not needed here if using layout.tsx for global metadata
// import Head from 'next/head';

import PeopleForm from './components/PeopleForm';
import ExpenseForm from './components/ExpenseForm';
import ExpensesList from './components/ExpensesList';
import SummaryView from './components/SummaryView';
import {
  Person,
  Expense,
  Balance,
  Transaction,
  calculateBalances,
  settleDebts,
} from './lib/splitter';

export default function Home() {
  const [people, setPeople] = useState<Person[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleAddPerson = (name: string) => {
    const newPerson: Person = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
    };
    setPeople((prevPeople) => [...prevPeople, newPerson]);
  };

  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };

  useEffect(() => {
    if (people.length > 0) {
      const newBalances = calculateBalances(people, expenses);
      setBalances(newBalances);
      const newTransactions = settleDebts(newBalances);
      setTransactions(newTransactions);
    } else {
      setBalances([]);
      setTransactions([]);
    }
  }, [people, expenses]);

  return (
    // <main className="min-h-screen bg-ios-light-gray py-8 px-4 sm:px-6 lg:px-8"> // Body already has bg-ios-light-gray
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl"> {/* Increased max-width slightly */}
        <header className="text-center mb-10 pt-6 pb-2"> {/* Added some padding */}
          <h1 className="text-4xl font-bold text-ios-almost-black"> {/* Adjusted font-weight and color */}
            Bill Splitter
          </h1>
          {/* Removed tagline for cleaner iOS feel, or could be restyled if kept
          <p className="text-lg text-ios-dark-gray mt-2">
            Easily divide expenses and settle debts.
          </p> */}
        </header>

        <div className="space-y-8"> {/* Use space-y for consistent vertical spacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"> {/* Adjusted gap */}
            <PeopleForm people={people} onAddPerson={handleAddPerson} />
            <ExpenseForm people={people} onAddExpense={handleAddExpense} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"> {/* Adjusted gap */}
            <ExpensesList expenses={expenses} people={people} />
            <SummaryView balances={balances} transactions={transactions} people={people} />
          </div>
        </div>
        
        <footer className="text-center mt-16 mb-8 text-sm text-ios-dark-gray">
          <p>Simplified Bill Management</p>
        </footer>
      </div>
    </main>
  );
}
