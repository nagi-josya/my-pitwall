export interface ChampionshipStandings {
  drivers: ChampionshipDriver[];
  teams: ChampionshipTeam[];
}

export interface ChampionshipDriver {
  driverNumber: number;
  tla: string;
  fullName: string;
  teamName: string;
  teamColor: string;
  headshotUrl: string | null;
  position: number;
  points: number;
}

export interface ChampionshipTeam {
  teamName: string;
  position: number;
  points: number;
}
