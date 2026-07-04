import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DriverPanelComponent } from '../driver-panel/driver-panel.component';
import { RaceEventsFeedComponent } from '../race-events/race-events-feed.component';
import { SessionSelectorComponent } from '../session-selector/session-selector.component';
import { TimingTowerComponent } from '../timing-tower/timing-tower.component';
import { TrackMapComponent } from '../track-map/track-map.component';
import { ReplayFacade } from './replay.facade';

@Component({
  selector: 'app-replay-page',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, SessionSelectorComponent, TimingTowerComponent, TrackMapComponent, DriverPanelComponent, RaceEventsFeedComponent],
  providers: [ReplayFacade],
  template: `
    <main class="pitwall-shell">
      <header class="top-bar">
        <div>
          <p class="eyebrow">Historical Replay</p>
          <h1>My Pitwall</h1>
        </div>
        <div class="replay-controls">
          <button type="button">Play</button>
          <button type="button">Pause</button>
          <select aria-label="Replay speed">
            <option>1x</option>
            <option>2x</option>
            <option>5x</option>
          </select>
        </div>
      </header>

      <section class="selector-bar">
        <app-session-selector
          [selectedYear]="(facade.selectedYear$ | async) ?? 2024"
          [selectedMeetingKey]="facade.selectedMeetingKey$ | async"
          [selectedSessionKey]="facade.selectedSessionKey$ | async"
          [meetings]="(facade.meetings$ | async) ?? []"
          [sessions]="(facade.sessions$ | async) ?? []"
          (yearChange)="facade.selectYear($event)"
          (meetingChange)="facade.selectMeeting($event)"
          (sessionChange)="facade.selectSession($event)"
        />
      </section>

      @if (facade.frame$ | async; as frame) {
        <section class="dashboard">
          <app-timing-tower
            [drivers]="frame.drivers"
            (driverSelected)="facade.selectDriver($event)"
          />
          <app-track-map
            [drivers]="frame.drivers"
            (driverSelected)="facade.selectDriver($event)"
          />
          <app-driver-panel [driver]="facade.selectedDriver$ | async" />
          <app-race-events-feed [events]="frame.events" />
        </section>
      } @else if (facade.selectedSessionKey$ | async) {
        <section class="loading-panel">
          <h2>Loading replay data</h2>
          <p>Fetching the opening frame from the pitwall backend.</p>
        </section>
      } @else {
        <section class="loading-panel">
          <h2>Select a session</h2>
          <p>Choose a year, race, and session above to begin.</p>
        </section>
      }
    </main>
  `,
  styleUrl: './replay-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReplayPageComponent {
  constructor(readonly facade: ReplayFacade) {}
}
