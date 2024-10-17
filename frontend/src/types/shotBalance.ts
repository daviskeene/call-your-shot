export interface ShotBalance {
    total_shots_i_owe: number;
    total_shots_others_owe_me: number;
    shots_i_owe_breakdown: { [key: string]: number };
    shots_others_owe_me_breakdown: { [key: string]: number };
  }
  