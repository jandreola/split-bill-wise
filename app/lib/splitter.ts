export interface Person {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidById: string; // ID of the Person who paid
  participantIds: string[]; // IDs of People who participated
}

export interface Balance {
  personId: string;
  name: string; // Name of the person for easier display
  amount: number; // Positive if owed to, negative if owes
}

export interface Transaction {
  fromId: string;
  toId: string;
  amount: number;
  fromName?: string; // Optional: for easier display
  toName?: string;   // Optional: for easier display
}

/**
 * Calculates the balance for each person based on the expenses.
 * @param people - Array of all people involved.
 * @param expenses - Array of all expenses.
 * @returns Array of balances for each person.
 */
export function calculateBalances(
  people: Person[],
  expenses: Expense[]
): Balance[] {
  const balances: { [personId: string]: number } = {};

  // Initialize balances
  for (const person of people) {
    balances[person.id] = 0;
  }

  // Calculate shares and update balances
  for (const expense of expenses) {
    if (expense.amount <= 0 || expense.participantIds.length === 0) {
      continue; // Skip invalid or zero-amount expenses
    }

    const share = expense.amount / expense.participantIds.length;

    // Add to payer's balance
    balances[expense.paidById] += expense.amount;

    // Subtract from participants' balances
    for (const participantId of expense.participantIds) {
      balances[participantId] -= share;
    }
  }

  return people.map((person) => ({
    personId: person.id,
    name: person.name,
    amount: parseFloat(balances[person.id].toFixed(2)), // Round to 2 decimal places
  }));
}

/**
 * Simplifies debts to a minimum number of transactions.
 * This function takes the balances and figures out who should pay whom.
 * @param balances - Array of balances calculated from expenses.
 * @returns Array of transactions to settle all debts.
 */
export function settleDebts(balances: Balance[]): Transaction[] {
  const transactions: Transaction[] = [];
  const debtors = balances
    .filter((b) => b.amount < 0)
    .sort((a, b) => a.amount - b.amount); // Sort by who owes the most
  const creditors = balances
    .filter((b) => b.amount > 0)
    .sort((a, b) => b.amount - a.amount); // Sort by who is owed the most

  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const amountToTransfer = Math.min(-debtor.amount, creditor.amount);

    if (amountToTransfer > 0) {
      transactions.push({
        fromId: debtor.personId,
        toId: creditor.personId,
        fromName: debtor.name, // Include names for easier understanding
        toName: creditor.name,   // Include names for easier understanding
        amount: parseFloat(amountToTransfer.toFixed(2)),
      });

      debtor.amount += amountToTransfer;
      creditor.amount -= amountToTransfer;
    }

    if (Math.abs(debtor.amount) < 0.01) { // Using a small epsilon for float comparison
      debtorIndex++;
    }
    if (Math.abs(creditor.amount) < 0.01) {
      creditorIndex++;
    }
  }

  return transactions;
}
