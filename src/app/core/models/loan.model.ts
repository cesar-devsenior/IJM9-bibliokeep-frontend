export interface Loan {
  id: number; // Long
  bookId: number; // Long (Foreign Key)
  contactName: string;
  loanDate: string; // LocalDate (YYYY-MM-DD)
  dueDate: string; // LocalDate (YYYY-MM-DD)
  returned: boolean;
}

