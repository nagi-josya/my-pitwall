import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DriverFrame } from '../../shared/models/replay-frame.model';

@Component({
  selector: 'app-driver-grid',
  standalone: true,
  template: `
    <section class="driver-grid" aria-label="Driver standings grid">
      @for (driver of drivers; track driver.driverNumber) {
        <button class="card" type="button" (click)="driverSelected.emit(driver.driverNumber)">
          <span class="pos">{{ driver.position ?? '-' }}</span>
          <img class="avatar" [src]="driver.headshotUrl" alt="" loading="lazy" (error)="onImgError($event, driver)" />
          <div class="info">
            <span class="name">{{ driver.fullName }}</span>
            <span class="team">{{ driver.teamName }}</span>
          </div>
          <span class="gap">{{ driver.gapToLeader ?? driver.intervalToCarAhead ?? '' }}</span>
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
    </section>
  `,
  styles: [`
    .driver-grid {
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      height: 100%;
      align-content: start;
      padding: 12px;
      background: rgba(10, 12, 16, 0.78);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      overflow-y: auto;
    }

    .card {
      align-items: center;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      color: #f4f4f2;
      cursor: pointer;
      display: grid;
      gap: 10px;
      grid-template-columns: 28px 36px 1fr auto;
      padding: 10px 12px;
      position: relative;
      text-align: left;
      transition: background 0.15s;
      width: 100%;
    }

    .card:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .card:hover .tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0);
    }

    .tooltip {
      background: #1a1d23;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
      color: #f4f4f2;
      left: 50%;
      opacity: 0;
      padding: 12px 14px;
      pointer-events: none;
      position: absolute;
      top: calc(100% + 8px);
      transform: translateX(-50%) translateY(-4px);
      transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
      visibility: hidden;
      width: 200px;
      z-index: 100;
    }

    .tooltip-title {
      font-size: 0.85rem;
      font-weight: 700;
      margin-bottom: 8px;
      padding-bottom: 6px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .tooltip-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 3px 0;
    }

    .tooltip-label {
      color: #8f969c;
      font-size: 0.75rem;
    }

    .tooltip-value {
      font-size: 0.8rem;
      font-weight: 700;
    }

    .pos {
      font-size: 1.1rem;
      font-weight: 800;
      text-align: center;
    }

    .avatar {
      border-radius: 50%;
      height: 36px;
      width: 36px;
      flex-shrink: 0;
      object-fit: cover;
    }

    .info {
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 0;
      overflow: hidden;
    }

    .name {
      font-size: 0.85rem;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .team {
      color: #8f969c;
      font-size: 0.72rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .gap {
      color: #cfd3d6;
      font-size: 0.82rem;
      font-weight: 600;
      white-space: nowrap;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DriverGridComponent {
  @Input({ required: true }) drivers: DriverFrame[] = [];
  @Output() readonly driverSelected = new EventEmitter<number>();

  onImgError(event: Event, driver: DriverFrame): void {
    const img = event.target as HTMLImageElement;
    if (img && img.src !== img.dataset['fallback']) {
      const color = driver.teamColor.replace('#', '');
      const name = encodeURIComponent(driver.fullName);
      img.dataset['fallback'] = `https://ui-avatars.com/api/?name=${name}&background=${color}&color=fff&size=72&rounded=true&bold=true`;
      img.src = img.dataset['fallback'];
    }
  }
}
