import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RaceEvent } from '../../shared/models/replay-frame.model';

@Component({
  selector: 'app-race-events-feed',
  standalone: true,
  template: `
    <section class="events-feed">
      <h2>Race Events</h2>
      @if (events.length > 0) {
        @for (event of events; track event.timestamp + event.message) {
          <article>
            <strong>{{ event.type }}</strong>
            <span>{{ event.message }}</span>
          </article>
        }
      } @else {
        <p>No events in this frame yet.</p>
      }
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

    article {
      display: grid;
      gap: 4px;
      padding: 10px 0;
    }

    p,
    span {
      color: #cfd3d6;
      margin: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaceEventsFeedComponent {
  @Input({ required: true }) events: RaceEvent[] = [];
}
