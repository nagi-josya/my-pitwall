import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MeetingSummary, SessionSummary } from '../../shared/models/session-summary.model';
import { AVAILABLE_YEARS } from '../../shared/constants';

@Component({
  selector: 'app-session-selector',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="session-selector">
      <label>
        Year
        <select [value]="selectedYear" (change)="onYearChange($event)">
          @for (year of availableYears; track year) {
            <option [value]="year">{{ year }}</option>
          }
        </select>
      </label>

      <label>
        Race
        <select
          [value]="selectedMeetingKey ?? ''"
          (change)="onMeetingChange($event)"
          [disabled]="!meetings.length"
        >
          <option value="" disabled>Select race</option>
          @for (meeting of meetings; track meeting.meetingKey) {
            <option [value]="meeting.meetingKey">
              {{ meeting.countryName }} — {{ meeting.location }}
            </option>
          }
        </select>
      </label>

      <label>
        Session
        <select
          [value]="selectedSessionKey ?? ''"
          (change)="onSessionChange($event)"
          [disabled]="!sessions.length"
        >
          <option value="" disabled>Select session</option>
          @for (session of sessions; track session.sessionKey) {
            <option [value]="session.sessionKey">
              {{ session.sessionName }}
              @if (session.startDate) {
                — {{ session.startDate | date:'shortDate' }}
              }
            </option>
          }
        </select>
      </label>
    </div>
  `,
  styleUrl: './session-selector.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionSelectorComponent {
  readonly availableYears = AVAILABLE_YEARS;

  @Input() selectedYear = 2024;
  @Input() selectedMeetingKey: number | null = null;
  @Input() selectedSessionKey: number | null = null;
  @Input() meetings: MeetingSummary[] = [];
  @Input() sessions: SessionSummary[] = [];

  @Output() readonly yearChange = new EventEmitter<number>();
  @Output() readonly meetingChange = new EventEmitter<number>();
  @Output() readonly sessionChange = new EventEmitter<number>();

  onYearChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.yearChange.emit(+value);
  }

  onMeetingChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.meetingChange.emit(+value);
  }

  onSessionChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.sessionChange.emit(+value);
  }
}
