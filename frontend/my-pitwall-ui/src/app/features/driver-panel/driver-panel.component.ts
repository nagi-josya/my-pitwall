import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DriverFrame } from '../../shared/models/replay-frame.model';

@Component({
  selector: 'app-driver-panel',
  standalone: true,
  template: `
    <section class="driver-panel">
      @if (driver) {
        <div class="identity">
          <span class="stripe" [style.background]="driver.teamColor"></span>
          <div>
            <h2>{{ driver.tla }}</h2>
            <p>{{ driver.fullName }} · {{ driver.teamName }}</p>
          </div>
        </div>
        <dl>
          <div><dt>Position</dt><dd>{{ driver.position ?? '-' }}</dd></div>
          <div><dt>Lap</dt><dd>{{ driver.currentLap ?? '-' }}</dd></div>
          <div><dt>Tyre</dt><dd>{{ driver.tyreCompound ?? 'Unknown' }}</dd></div>
          <div><dt>Age</dt><dd>{{ driver.tyreAge ?? '-' }}</dd></div>
        </dl>
      }
    </section>
  `,
  styles: [`
    .driver-panel {
      background: rgba(10, 12, 16, 0.78);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 16px;
    }

    .identity {
      align-items: center;
      display: flex;
      gap: 12px;
      margin-bottom: 14px;
    }

    .stripe {
      border-radius: 999px;
      height: 48px;
      width: 6px;
    }

    h2,
    p {
      margin: 0;
    }

    p {
      color: #cfd3d6;
    }

    dl {
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      margin: 0;
    }

    dt {
      color: #8f969c;
      font-size: 0.75rem;
      text-transform: uppercase;
    }

    dd {
      font-size: 1.3rem;
      font-weight: 800;
      margin: 2px 0 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DriverPanelComponent {
  @Input() driver: DriverFrame | null = null;
}
