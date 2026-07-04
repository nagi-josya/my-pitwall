import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReplayPageComponent } from './features/replay/replay-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReplayPageComponent],
  template: '<app-replay-page />',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
