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
          <div class="tooltip" (click)="$event.stopPropagation()">
            <div class="tooltip-title">{{ driver.fullName }}</div>
            <div class="tooltip-row">
              <span class="tooltip-label">Team</span>
              <span class="tooltip-value">{{ driver.teamName }}</span>
            </div>
            <div class="tooltip-row">
              <span class="tooltip-label">Position</span>
              <span class="tooltip-value">{{ driver.position ?? '-' }}</span>
            </div>
          </div>
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

    .row:hover .tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateX(0) translateY(0);
    }

    .tooltip {
      background: #1a1d23;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
      color: #f4f4f2;
      left: calc(100% + 8px);
      opacity: 0;
      padding: 10px 12px;
      pointer-events: none;
      position: absolute;
      top: 50%;
      transform: translateX(-4px) translateY(-50%);
      transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
      visibility: hidden;
      width: 190px;
      z-index: 100;
    }

    .tooltip-title {
      font-size: 0.82rem;
      font-weight: 700;
      margin-bottom: 6px;
      padding-bottom: 5px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .tooltip-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 0;
    }

    .tooltip-label {
      color: #8f969c;
      font-size: 0.72rem;
    }

    .tooltip-value {
      font-size: 0.78rem;
      font-weight: 700;
    }

    .row {
      position: relative;
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
