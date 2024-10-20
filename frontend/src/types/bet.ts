export interface Bet {
  id: number;
  bettor_id: number;
  bettee_id: number;
  shots: number;
  description?: string;
  date_created?: string;
  outcome?: string;
  bettor_name?: string;
  bettee_name?: string;
}
