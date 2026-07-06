import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChampionshipDriver, ChampionshipTeam } from '../../shared/models/standings.model';

@Component({
  selector: 'app-standings-panel',
  standalone: true,
  template: `
    <aside class="standings-panel">
      <div class="section">
        <h3>Drivers</h3>
        <div class="standings-grid">
          @for (driver of drivers; track driver.driverNumber) {
            <div class="row">
              <span class="pos">{{ driver.position }}</span>
              <span class="stripe" [style.background]="driver.teamColor"></span>
              <span class="tla">{{ driver.tla }}</span>
              <span class="name">{{ driver.teamName }}</span>
              <span class="pts">{{ driver.points }} pts</span>
            </div>
          }
        </div>
      </div>
      <div class="section">
        <h3>Constructors</h3>
        <div class="standings-grid">
          @for (team of teams; track team.teamName) {
            <div class="row">
              <span class="pos">{{ team.position }}</span>
              <span class="name team-name">{{ team.teamName }}</span>
              <span class="pts">{{ team.points }} pts</span>
            </div>
          }
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .standings-panel {
      background: rgba(10, 12, 16, 0.78);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 14px;
    }

    .section {
      margin-bottom: 16px;
    }

    .section:last-child {
      margin-bottom: 0;
    }

    h3 {
      color: #00d2be;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0;
      text-transform: uppercase;
      margin: 0 0 6px;
    }

    .standings-grid {
      display: grid;
      gap: 4px;
    }

    .section:first-child .standings-grid {
      grid-template-columns: 20px 3px auto 1fr auto;
    }

    .section:last-child .standings-grid {
      grid-template-columns: 20px 1fr auto;
    }

    .row {
      display: contents;
    }

    .pos {
      font-weight: 800;
      font-size: 0.78rem;
      text-align: center;
      padding: 2px 0;
    }

    .stripe {
      border-radius: 999px;
      height: 14px;
      width: 3px;
      align-self: center;
    }

    .tla {
      font-weight: 700;
      font-size: 0.75rem;
      padding: 2px 0;
    }

    .name {
      font-size: 0.75rem;
      padding: 2px 0;
      color: #cfd3d6;
    }

    .team-name {
      font-weight: 600;
    }

    .pts {
      color: #8f969c;
      font-size: 0.7rem;
      font-weight: 600;
      text-align: right;
      padding: 2px 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StandingsPanelComponent {
  @Input({ required: true }) drivers: ChampionshipDriver[] = [];
  @Input({ required: true }) teams: ChampionshipTeam[] = [];
}
