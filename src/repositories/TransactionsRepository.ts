import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    let income: number = 0,
      outcome: number = 0,
      total: number = 0;

    this.transactions.map(transaction => {
      if (transaction.type === 'income') {
        income += transaction.value;
      } else {
        outcome += transaction.value;
      }
    });

    total = income - outcome;
    return { income, outcome, total };
  }

  public create({ title, value, type }: Request): Transaction {
    const transaction = new Transaction({ title, value, type });

    if (transaction.type === 'outcome') {
      const balance = this.getBalance();
      if (transaction.value > balance.total) {
        throw new Error('Invalid transaction value.');
      }
    }

    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
