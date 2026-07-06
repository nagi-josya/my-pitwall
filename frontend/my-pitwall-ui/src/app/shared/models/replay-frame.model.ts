export interface DriverCareer {
  debutYear: number;
  podiums: number;
  highestFinish: number;
  championshipYears: number[] | null;
}

export interface ReplayFrame {
  sessionKey: number;
  sessionTime: string;
  lap: number | null;
  drivers: DriverFrame[];
  events: RaceEvent[];
}

export interface DriverFrame {
  driverNumber: number;
  tla: string;
  fullName: string;
  teamName: string;
  teamColor: string;
  headshotUrl: string | null;
  position: number | null;
  gapToLeader: string | null;
  intervalToCarAhead: string | null;
  currentLap: number | null;
  tyreCompound: string | null;
  tyreAge: number | null;
  trackPosition: TrackPosition | null;
  trail: TrackPosition[];
}

export interface TrackPosition {
  x: number;
  y: number;
  z: number | null;
}

export interface RaceEvent {
  type: string;
  driverNumber: number | null;
  message: string;
  timestamp: string;
}
