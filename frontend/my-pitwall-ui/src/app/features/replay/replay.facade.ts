import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, map, of, startWith, switchMap } from 'rxjs';
import { PitwallApiService } from '../../core/api/pitwall-api.service';
import { ReplayHubService } from '../../core/signalr/replay-hub.service';

@Injectable()
export class ReplayFacade {
  private readonly selectedSessionKeySubject = new BehaviorSubject<number>(9158);
  private readonly selectedDriverNumberSubject = new BehaviorSubject<number | null>(null);

  readonly selectedDriverNumber$ = this.selectedDriverNumberSubject.asObservable();

  readonly frame$ = this.selectedSessionKeySubject.pipe(
    switchMap((sessionKey) =>
      this.api.previewReplay(sessionKey).pipe(
        map((frame) => {
          this.hub.publishPreviewFrame(frame);
          return frame;
        }),
        catchError(() => of(null))
      )
    ),
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

  constructor(
    private readonly api: PitwallApiService,
    private readonly hub: ReplayHubService
  ) {}

  selectDriver(driverNumber: number): void {
    this.selectedDriverNumberSubject.next(driverNumber);
  }
}
