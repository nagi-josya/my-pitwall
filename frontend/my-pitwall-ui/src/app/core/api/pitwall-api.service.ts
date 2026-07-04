import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReplayFrame } from '../../shared/models/replay-frame.model';
import { MeetingSummary, SessionSummary } from '../../shared/models/session-summary.model';

@Injectable({ providedIn: 'root' })
export class PitwallApiService {
  private readonly baseUrl = 'https://localhost:7009/api';

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
}
