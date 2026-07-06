import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { DriverCareer, DriverFrame } from '../../shared/models/replay-frame.model';

@Component({
  selector: 'app-driver-panel',
  standalone: true,
  imports: [AsyncPipe],
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
        @if (career) {
          <div class="career">
            <h3>Career</h3>
            <div class="career-grid">
              <div class="career-item">
                <span class="career-label">Debut</span>
                <span class="career-value">{{ career.debutYear }}</span>
              </div>
              <div class="career-item">
                <span class="career-label">Podiums</span>
                <span class="career-value">{{ career.podiums }}</span>
              </div>
              <div class="career-item">
                <span class="career-label">Best Finish</span>
                <span class="career-value">{{ formatFinish(career.highestFinish) }}</span>
              </div>
              <div class="career-item">
                <span class="career-label">Champion</span>
                <span class="career-value champion" [class.yes]="career.championshipYears && career.championshipYears.length > 0">{{ formatChampion(career.championshipYears) }}</span>
              </div>
            </div>
          </div>
        }
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

    .career {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      margin-top: 14px;
      padding-top: 14px;
    }

    .career h3 {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      color: #8f969c;
      margin: 0 0 10px;
      letter-spacing: 0.05em;
    }

    .career-grid {
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(2, 1fr);
    }

    .career-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .career-label {
      color: #8f969c;
      font-size: 0.7rem;
      text-transform: uppercase;
    }

    .career-value {
      font-size: 1rem;
      font-weight: 700;
    }

    .career-value.champion.yes {
      color: #f5c542;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DriverPanelComponent {
  @Input() driver: DriverFrame | null = null;
  @Input() career: DriverCareer | null = null;

  formatFinish(finish: number): string {
    if (finish === 1) return '1st (Win)';
    if (finish === 2) return '2nd';
    if (finish === 3) return '3rd';
    return `${finish}th`;
  }

  formatChampion(years: number[] | null): string {
    if (!years || years.length === 0) return 'No';
    return years.join(', ');
  }
}
