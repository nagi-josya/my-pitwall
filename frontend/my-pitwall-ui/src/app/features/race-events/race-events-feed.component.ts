import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RaceEvent } from '../../shared/models/replay-frame.model';

@Component({
  selector: 'app-race-events-feed',
  standalone: true,
  imports: [DatePipe],
  template: `
    <section class="events-feed">
      <h2>Race Events</h2>
      <div class="events-scroll">
        @if (events.length > 0) {
          @for (event of events; track event.timestamp + event.message) {
            <article>
              <time>{{ event.timestamp | date:'HH:mm:ss' }}</time>
              <span class="type">{{ event.type }}</span>
              <span class="msg">{{ event.message }}</span>
            </article>
          }
        } @else {
          <p>No events in this frame yet.</p>
        }
      </div>
    </section>
  `,
  styles: [`
    .events-feed {
      background: rgba(10, 12, 16, 0.78);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 16px;
    }

    h2 {
      font-size: 1rem;
      margin: 0 0 12px;
    }

    .events-scroll {
      max-height: 320px;
      overflow-y: auto;
      overscroll-behavior: contain;
    }

    article {
      display: grid;
      grid-template-columns: auto auto 1fr;
      gap: 8px;
      padding: 6px 0;
      align-items: baseline;
    }

    article + article {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    time {
      color: #8f969c;
      font-size: 0.75rem;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    .type {
      color: #00d2be;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      white-space: nowrap;
    }

    p,
    .msg {
      color: #cfd3d6;
      margin: 0;
      font-size: 0.78rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaceEventsFeedComponent {
  @Input({ required: true }) events: RaceEvent[] = [];
}
