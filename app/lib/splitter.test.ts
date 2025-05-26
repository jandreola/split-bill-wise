// app/lib/splitter.test.ts
import { Person, Expense, calculateBalances, settleDebts } from './splitter';

describe('Bill Splitting Logic', () => {
  const people: Person[] = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
  ];

  describe('calculateBalances', () => {
    it('should return zero balances if no expenses', () => {
      const expenses: Expense[] = [];
      const balances = calculateBalances(people, expenses);
      balances.forEach((balance) => expect(balance.amount).toBe(0));
    });

    it('should calculate balances correctly for a single expense paid by one, shared by all', () => {
      const expenses: Expense[] = [
        {
          id: 'e1',
          description: 'Dinner',
          amount: 90,
          paidById: '1', // Alice paid
          participantIds: ['1', '2', '3'], // Alice, Bob, Charlie participated
        },
      ];
      const balances = calculateBalances(people, expenses);
      // Alice: 90 - (90/3) = 60
      // Bob: -(90/3) = -30
      // Charlie: -(90/3) = -30
      expect(balances.find((b) => b.personId === '1')?.amount).toBe(60);
      expect(balances.find((b) => b.personId === '2')?.amount).toBe(-30);
      expect(balances.find((b) => b.personId === '3')?.amount).toBe(-30);
    });

    it('should calculate balances correctly when one person pays for themself only', () => {
      const expenses: Expense[] = [
        {
          id: 'e1',
          description: 'Lunch',
          amount: 20,
          paidById: '1', // Alice paid
          participantIds: ['1'], // Only Alice participated
        },
      ];
      const balances = calculateBalances(people, expenses);
      // Alice: 20 - (20/1) = 0
      // Bob: 0
      // Charlie: 0
      expect(balances.find((b) => b.personId === '1')?.amount).toBe(0);
      expect(balances.find((b) => b.personId === '2')?.amount).toBe(0);
      expect(balances.find((b) => b.personId === '3')?.amount).toBe(0);
    });

    it('should handle multiple expenses correctly', () => {
      const expenses: Expense[] = [
        {
          id: 'e1',
          description: 'Groceries',
          amount: 60,
          paidById: '1', // Alice paid
          participantIds: ['1', '2'],    // Alice, Bob
        },
        {
          id: 'e2',
          description: 'Movie Tickets',
          amount: 45,
          paidById: '2', // Bob paid
          participantIds: ['1', '2', '3'], // Alice, Bob, Charlie
        },
      ];
      // Alice: (60 - 60/2) + (-45/3) = 30 - 15 = 15
      // Bob: (-60/2) + (45 - 45/3) = -30 + 30 = 0
      // Charlie: (-45/3) = -15
      const balances = calculateBalances(people, expenses);
      expect(balances.find((b) => b.personId === '1')?.amount).toBe(15);
      expect(balances.find((b) => b.personId === '2')?.amount).toBe(0);
      expect(balances.find((b) => b.personId === '3')?.amount).toBe(-15);
    });
    
    it('should handle expenses with floating point amounts correctly', () => {
      const expenses: Expense[] = [
        {
          id: 'e1',
          description: 'Coffee',
          amount: 10.50,
          paidById: '1',
          participantIds: ['1', '2'], // Alice, Bob
        },
      ];
      // Alice: 10.50 - (10.50/2) = 5.25
      // Bob: -(10.50/2) = -5.25
      const balances = calculateBalances(people, expenses);
      expect(balances.find(b => b.personId === '1')?.amount).toBe(5.25);
      expect(balances.find(b => b.personId === '2')?.amount).toBe(-5.25);
      expect(balances.find(b => b.personId === '3')?.amount).toBe(0);
    });

    it('should ignore expenses with zero or negative amount or no participants', () => {
        const expenses: Expense[] = [
            { id: 'e1', description: 'Valid Expense', amount: 30, paidById: '1', participantIds: ['1', '2', '3'] },
            { id: 'e2', description: 'Zero Amount', amount: 0, paidById: '1', participantIds: ['1', '2'] },
            { id: 'e3', description: 'No Participants', amount: 50, paidById: '2', participantIds: [] },
            { id: 'e4', description: 'Negative Amount', amount: -20, paidById: '3', participantIds: ['1', '3'] },
        ];
        // Expected: Alice: 30 - 10 = 20; Bob: -10; Charlie: -10
        const balances = calculateBalances(people, expenses);
        expect(balances.find(b => b.personId === '1')?.amount).toBe(20);
        expect(balances.find(b => b.personId === '2')?.amount).toBe(-10);
        expect(balances.find(b => b.personId === '3')?.amount).toBe(-10);
    });
  });

  describe('settleDebts', () => {
    it('should return no transactions if all balances are zero', () => {
      const balances = people.map(p => ({ personId: p.id, name: p.name, amount: 0 }));
      const transactions = settleDebts(balances);
      expect(transactions.length).toBe(0);
    });

    it('should settle simple debt: one debtor, one creditor', () => {
      const balances = [
        { personId: '1', name: 'Alice', amount: 30 },
        { personId: '2', name: 'Bob', amount: -30 },
        { personId: '3', name: 'Charlie', amount: 0 },
      ];
      const transactions = settleDebts(balances);
      // Bob pays Alice 30
      expect(transactions.length).toBe(1);
      expect(transactions[0].fromId).toBe('2');
      expect(transactions[0].toId).toBe('1');
      expect(transactions[0].amount).toBe(30);
    });

    it('should settle complex debts with multiple debtors and creditors', () => {
      // Alice owes 20, Bob is owed 50, Charlie owes 30
      // Expected: Alice pays Bob 20, Charlie pays Bob 30
      const balances = [
        { personId: '1', name: 'Alice', amount: -20 },
        { personId: '2', name: 'Bob', amount: 50 },
        { personId: '3', name: 'Charlie', amount: -30 },
      ];
      const transactions = settleDebts(balances);
      expect(transactions.length).toBe(2);

      const t1 = transactions.find(t => t.fromId === '3' && t.toId === '2'); // Charlie to Bob
      expect(t1?.amount).toBe(30);

      const t2 = transactions.find(t => t.fromId === '1' && t.toId === '2'); // Alice to Bob
      expect(t2?.amount).toBe(20);
    });

    it('should minimize transactions (complex case)', () => {
      // D owes A 10, C owes B 10, B owes A 10 (A gets 20, B is even, C pays 10, D pays 10)
      // Alice (A) is owed 20 (+20)
      // Bob (B) owes 10, is owed 10 (0)
      // Charlie (C) owes 10 (-10)
      // David (D) owes 10 (-10)
      // Expected: C -> A (10), D -> A (10)
      const peopleForComplexTest: Person[] = [
        { id: 'A', name: 'Alice' },
        { id: 'B', name: 'Bob' },
        { id: 'C', name: 'Charlie' },
        { id: 'D', name: 'David' },
      ];
      const balances = [
        { personId: 'A', name: 'Alice', amount: 20 },
        { personId: 'B', name: 'Bob', amount: 0 },
        { personId: 'C', name: 'Charlie', amount: -10 },
        { personId: 'D', name: 'David', amount: -10 },
      ];
      const transactions = settleDebts(balances);
      expect(transactions.length).toBe(2);
      // Sort transactions to make the test deterministic if order doesn't matter
      transactions.sort((a,b) => a.fromId.localeCompare(b.fromId));

      expect(transactions[0].fromId).toBe('C');
      expect(transactions[0].toId).toBe('A');
      expect(transactions[0].amount).toBe(10);

      expect(transactions[1].fromId).toBe('D');
      expect(transactions[1].toId).toBe('A');
      expect(transactions[1].amount).toBe(10);
    });
    
    it('should handle floating point amounts in transactions', () => {
      const balances = [
        { personId: '1', name: 'Alice', amount: 10.75 },
        { personId: '2', name: 'Bob', amount: -5.25 },
        { personId: '3', name: 'Charlie', amount: -5.50 },
      ];
      // Bob pays Alice 5.25
      // Charlie pays Alice 5.50
      const transactions = settleDebts(balances);
      expect(transactions.length).toBe(2);
      
      transactions.sort((a,b) => a.amount - b.amount); // sort by amount for consistent check

      expect(transactions[0].fromId).toBe('2'); // Bob
      expect(transactions[0].toId).toBe('1');   // Alice
      expect(transactions[0].amount).toBe(5.25);
      
      expect(transactions[1].fromId).toBe('3'); // Charlie
      expect(transactions[1].toId).toBe('1');   // Alice
      expect(transactions[1].amount).toBe(5.50);
    });
  });
});
