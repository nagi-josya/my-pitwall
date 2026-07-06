import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { DriverGridComponent } from '../driver-grid/driver-grid.component';
import { DriverPanelComponent } from '../driver-panel/driver-panel.component';
import { RaceEventsFeedComponent } from '../race-events/race-events-feed.component';
import { SessionSelectorComponent } from '../session-selector/session-selector.component';
import { StandingsPanelComponent } from '../standings-panel/standings-panel.component';
import { ReplayFacade } from './replay.facade';
import { PitwallApiService } from '../../core/api/pitwall-api.service';

@Component({
  selector: 'app-replay-page',
  standalone: true,
  imports: [AsyncPipe, SessionSelectorComponent, DriverGridComponent, DriverPanelComponent, RaceEventsFeedComponent, StandingsPanelComponent],
  providers: [ReplayFacade],
  template: `
    <main class="pitwall-shell">
      <header class="top-bar">
        <div>
          <p class="eyebrow">Learn about F1 stats throughout the years</p>
          <h1>Anndddd it's lights out!!!</h1>
        </div>
      </header>

      <section class="selector-bar">
        @if (openf1Message(); as msg) {
          <div class="openf1-warning">{{ msg }}</div>
        }
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

      @if (facade.incompleteSessionName$ | async; as sessionName) {
        <section class="loading-panel">
          <h2>Session not yet completed</h2>
          <p>
            Results can only be viewed for completed sessions.
            "{{ sessionName }}" has not finished yet — check back after the session ends.
          </p>
        </section>
      } @else {
        @if (facade.frame$ | async; as frame) {
          <section class="dashboard">
            <app-standings-panel
              [drivers]="(facade.standings$ | async)?.drivers ?? []"
              [teams]="(facade.standings$ | async)?.teams ?? []"
            />
            <div class="main-panel">
              <app-driver-grid
                [drivers]="frame.drivers"
                (driverSelected)="facade.selectDriver($event)"
              />
              <app-race-events-feed [events]="frame.events" />
              <app-driver-panel
                [driver]="facade.selectedDriver$ | async"
                [career]="facade.selectedDriverCareer$ | async"
              />
            </div>
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
      }
    </main>
  `,
  styleUrl: './replay-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReplayPageComponent implements OnInit {
  readonly openf1Message = signal<string | null>(null);

  constructor(
    readonly facade: ReplayFacade,
    private readonly api: PitwallApiService
  ) {}

  ngOnInit(): void {
    this.api.getStatus().subscribe({
      next: (status) => this.openf1Message.set(status.openf1Message),
      error: () => this.openf1Message.set('Failed to check API status.')
    });
  }
}
