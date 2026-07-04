export interface MeetingSummary {
  meetingKey: number;
  year: number;
  countryName: string;
  location: string;
  startDate: string | null;
}

export interface SessionSummary {
  sessionKey: number;
  meetingKey: number;
  year: number;
  countryName: string;
  location: string;
  sessionName: string;
  startDate: string | null;
}
