import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReplayFrame } from '../../shared/models/replay-frame.model';

@Injectable({ providedIn: 'root' })
export class PitwallApiService {
  private readonly baseUrl = 'https://localhost:7009/api';

  constructor(private readonly http: HttpClient) {}

  previewReplay(sessionKey: number): Observable<ReplayFrame> {
    return this.http.post<ReplayFrame>(`${this.baseUrl}/replays/preview`, {
      sessionKey,
      speed: 1
    });
  }
}
