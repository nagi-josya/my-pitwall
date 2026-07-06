import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DriverCareer, ReplayFrame } from '../../shared/models/replay-frame.model';
import { MeetingSummary, SessionSummary } from '../../shared/models/session-summary.model';
import { ChampionshipStandings } from '../../shared/models/standings.model';

@Injectable({ providedIn: 'root' })
export class PitwallApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  getMeetings(year: number): Observable<MeetingSummary[]> {
    return this.http.get<MeetingSummary[]>(`${this.baseUrl}/meetings`, {
      params: { year }
    });
  }

  getSessions(year: number, meetingKey: number): Observable<SessionSummary[]> {
    return this.http.get<SessionSummary[]>(`${this.baseUrl}/sessions`, {
      params: { year, meetingKey }
    });
  }

  previewReplay(sessionKey: number): Observable<ReplayFrame> {
    return this.http.post<ReplayFrame>(`${this.baseUrl}/replays/preview`, {
      sessionKey,
      speed: 1
    });
  }

  getStatus(): Observable<{ openf1Message: string | null }> {
    return this.http.get<{ openf1Message: string | null }>(`${this.baseUrl}/status`);
  }

  getDriverCareer(sessionKey: number, driverNumber: number): Observable<DriverCareer | null> {
    return this.http.get<DriverCareer | null>(`${this.baseUrl}/replays/${sessionKey}/drivers/${driverNumber}/career`);
  }

  getStandings(sessionKey: number): Observable<ChampionshipStandings> {
    return this.http.get<ChampionshipStandings>(`${this.baseUrl}/standings`, {
      params: { sessionKey }
    });
  }
}
