export interface User {
  id: number;
  name: string;
  email: string;
  totalShotsOwed?: number;
  totalShotsOwedTo?: number;
}
