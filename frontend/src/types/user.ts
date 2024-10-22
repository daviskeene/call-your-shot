export interface User {
  id: number | string;
  name: string;
  email: string;
  totalShotsOwed?: number;
  totalShotsOwedTo?: number;
}
