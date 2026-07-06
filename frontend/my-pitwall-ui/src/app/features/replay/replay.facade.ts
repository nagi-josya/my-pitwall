import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, map, of, startWith, switchMap } from 'rxjs';
import { PitwallApiService } from '../../core/api/pitwall-api.service';
import { ReplayHubService } from '../../core/signalr/replay-hub.service';
import { MeetingSummary, SessionSummary } from '../../shared/models/session-summary.model';
import { ChampionshipStandings } from '../../shared/models/standings.model';
import { DriverCareer } from '../../shared/models/replay-frame.model';

@Injectable()
export class ReplayFacade {
  private readonly selectedYearSubject = new BehaviorSubject<number>(2024);
  private readonly selectedMeetingKeySubject = new BehaviorSubject<number | null>(null);
  private readonly selectedSessionKeySubject = new BehaviorSubject<number | null>(null);
  private readonly selectedDriverNumberSubject = new BehaviorSubject<number | null>(null);

  readonly selectedYear$ = this.selectedYearSubject.asObservable();
  readonly selectedMeetingKey$ = this.selectedMeetingKeySubject.asObservable();
  readonly selectedSessionKey$ = this.selectedSessionKeySubject.asObservable();
  readonly selectedDriverNumber$ = this.selectedDriverNumberSubject.asObservable();

  readonly meetings$ = this.selectedYearSubject.pipe(
    switchMap((year) =>
      this.api.getMeetings(year).pipe(
        startWith([] as MeetingSummary[]),
        catchError(() => of([] as MeetingSummary[]))
      )
    )
  );

  readonly sessions$ = this.selectedMeetingKeySubject.pipe(
    switchMap((meetingKey) => {
      if (meetingKey === null) {
        return of([] as SessionSummary[]);
      }
      const year = this.selectedYearSubject.getValue();
      return this.api.getSessions(year, meetingKey).pipe(
        startWith([] as SessionSummary[]),
        catchError(() => of([] as SessionSummary[]))
      );
    })
  );

  readonly selectedSession$ = combineLatest([this.sessions$, this.selectedSessionKey$]).pipe(
    map(([sessions, sessionKey]) => sessions.find(s => s.sessionKey === sessionKey) ?? null)
  );

  readonly incompleteSessionName$ = this.selectedSession$.pipe(
    map(session => session && !session.isCompleted ? session.sessionName : null)
  );

  readonly frame$ = combineLatest([this.selectedSessionKey$, this.incompleteSessionName$]).pipe(
    switchMap(([sessionKey, incompleteSessionName]) => {
      if (sessionKey === null) {
        return of(null);
      }
      if (incompleteSessionName) {
        return of(null);
      }
      return this.api.previewReplay(sessionKey).pipe(
        map((frame) => {
          this.hub.publishPreviewFrame(frame);
          return frame;
        }),
        catchError(() => of(null))
      );
    }),
    startWith(null)
  );

  readonly standings$ = combineLatest([this.selectedSessionKey$, this.incompleteSessionName$]).pipe(
    switchMap(([sessionKey, incompleteSessionName]) => {
      if (sessionKey === null || incompleteSessionName) {
        return of(null);
      }
      return this.api.getStandings(sessionKey).pipe(
        catchError(() => of(null))
      );
    }),
    startWith(null)
  );

  readonly selectedDriver$ = combineLatest([this.frame$, this.selectedDriverNumber$]).pipe(
    map(([frame, driverNumber]) => {
      if (!frame || driverNumber === null) {
        return frame?.drivers[0] ?? null;
      }

      return frame.drivers.find((driver) => driver.driverNumber === driverNumber) ?? frame.drivers[0] ?? null;
    })
  );

  readonly selectedDriverCareer$ = combineLatest([this.selectedSessionKey$, this.selectedDriverNumber$]).pipe(
    switchMap(([sessionKey, driverNumber]) => {
      if (sessionKey === null || driverNumber === null) {
        return of(null);
      }
      return this.api.getDriverCareer(sessionKey, driverNumber).pipe(
        catchError(() => of(null))
      );
    }),
    startWith(null)
  );

  constructor(
    private readonly api: PitwallApiService,
    private readonly hub: ReplayHubService
  ) {}

  selectYear(year: number): void {
    this.selectedYearSubject.next(year);
    this.selectedMeetingKeySubject.next(null);
    this.selectedSessionKeySubject.next(null);
  }

  selectMeeting(meetingKey: number): void {
    this.selectedMeetingKeySubject.next(meetingKey);
    this.selectedSessionKeySubject.next(null);
  }

  selectSession(sessionKey: number): void {
    this.selectedSessionKeySubject.next(sessionKey);
  }

  selectDriver(driverNumber: number): void {
    this.selectedDriverNumberSubject.next(driverNumber);
  }
}
