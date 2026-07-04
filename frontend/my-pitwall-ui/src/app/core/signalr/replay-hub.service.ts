import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReplayFrame } from '../../shared/models/replay-frame.model';

@Injectable({ providedIn: 'root' })
export class ReplayHubService {
  private readonly frameSubject = new BehaviorSubject<ReplayFrame | null>(null);

  readonly frame$: Observable<ReplayFrame | null> = this.frameSubject.asObservable();

  publishPreviewFrame(frame: ReplayFrame): void {
    this.frameSubject.next(frame);
  }
}
