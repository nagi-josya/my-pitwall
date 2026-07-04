import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DriverFrame } from '../../shared/models/replay-frame.model';

@Component({
  selector: 'app-timing-tower',
  standalone: true,
  template: `
    <aside class="tower" aria-label="Timing tower">
      @for (driver of drivers; track driver.driverNumber) {
        <button class="row" type="button" (click)="driverSelected.emit(driver.driverNumber)">
          <span class="position">{{ driver.position ?? '-' }}</span>
          <span class="team" [style.background]="driver.teamColor"></span>
          <span class="tla">{{ driver.tla }}</span>
          <span class="gap">{{ driver.gapToLeader ?? driver.intervalToCarAhead ?? '-' }}</span>
        </button>
      }
    </aside>
  `,
  styles: [`
    .tower {
      background: rgba(10, 12, 16, 0.78);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      height: 100%;
      overflow-y: auto;
      overscroll-behavior: contain;
    }

    .row {
      align-items: center;
      background: transparent;
      border: 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      color: #f4f4f2;
      display: grid;
      gap: 8px;
      grid-template-columns: 28px 4px 1fr auto;
      min-height: 42px;
      padding: 0 10px;
      text-align: left;
      width: 100%;
    }

    .row:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .position,
    .tla {
      font-weight: 800;
    }

    .team {
      border-radius: 999px;
      height: 24px;
    }

    .gap {
      color: #cfd3d6;
      font-size: 0.85rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimingTowerComponent {
  @Input({ required: true }) drivers: DriverFrame[] = [];
  @Output() readonly driverSelected = new EventEmitter<number>();
}
