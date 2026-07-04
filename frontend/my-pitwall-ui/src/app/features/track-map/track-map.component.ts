import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild
} from '@angular/core';
import { DriverFrame } from '../../shared/models/replay-frame.model';

@Component({
  selector: 'app-track-map',
  standalone: true,
  template: `
    <section class="map-shell">
      <canvas
        #canvas
        class="track-canvas"
        (click)="selectNearestDriver($event)"
        (wheel)="zoom($event)"
        (pointerdown)="startPan($event)"
        (pointermove)="pan($event)"
        (pointerup)="stopPan()"
        (pointerleave)="stopPan()"
      ></canvas>
    </section>
  `,
  styles: [`
    .map-shell {
      background: radial-gradient(circle at center, rgba(255, 255, 255, 0.07), rgba(10, 12, 16, 0.94));
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      min-height: 100%;
      overflow: hidden;
      position: relative;
    }

    .track-canvas {
      display: block;
      height: 100%;
      touch-action: none;
      width: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackMapComponent implements AfterViewInit, OnChanges {
  @Input({ required: true }) drivers: DriverFrame[] = [];
  @Output() readonly driverSelected = new EventEmitter<number>();
  @ViewChild('canvas', { static: true }) private readonly canvasRef!: ElementRef<HTMLCanvasElement>;

  private scale = 1;
  private offsetX = 0;
  private offsetY = 0;
  private isPanning = false;
  private lastPointerX = 0;
  private lastPointerY = 0;

  ngAfterViewInit(): void {
    this.draw();
  }

  ngOnChanges(): void {
    this.draw();
  }

  zoom(event: WheelEvent): void {
    event.preventDefault();
    this.scale = Math.min(4, Math.max(0.6, this.scale + (event.deltaY > 0 ? -0.08 : 0.08)));
    this.draw();
  }

  startPan(event: PointerEvent): void {
    this.isPanning = true;
    this.lastPointerX = event.clientX;
    this.lastPointerY = event.clientY;
  }

  pan(event: PointerEvent): void {
    if (!this.isPanning) {
      return;
    }

    this.offsetX += event.clientX - this.lastPointerX;
    this.offsetY += event.clientY - this.lastPointerY;
    this.lastPointerX = event.clientX;
    this.lastPointerY = event.clientY;
    this.draw();
  }

  stopPan(): void {
    this.isPanning = false;
  }

  selectNearestDriver(event: MouseEvent): void {
    const canvas = this.canvasRef.nativeElement;
    const bounds = canvas.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const plotted = this.projectDrivers(canvas);

    const nearest = plotted
      .map((plot) => ({ ...plot, distance: Math.hypot(plot.x - x, plot.y - y) }))
      .sort((a, b) => a.distance - b.distance)[0];

    if (nearest && nearest.distance < 32) {
      this.driverSelected.emit(nearest.driver.driverNumber);
    }
  }

  private draw(): void {
    if (!this.canvasRef) {
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    const bounds = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(bounds.width * dpr));
    canvas.height = Math.max(1, Math.floor(bounds.height * dpr));

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    context.scale(dpr, dpr);
    context.clearRect(0, 0, bounds.width, bounds.height);
    this.drawFallbackTrack(context, bounds.width, bounds.height);

    for (const plot of this.projectDrivers(canvas)) {
      this.drawTrail(context, plot.driver, plot.x, plot.y);
      this.drawDriver(context, plot.driver, plot.x, plot.y);
    }
  }

  private projectDrivers(canvas: HTMLCanvasElement) {
    const bounds = canvas.getBoundingClientRect();
    const driversWithPositions = this.drivers.filter((driver) => driver.trackPosition);

    if (driversWithPositions.length === 0) {
      return this.drivers.map((driver, index) => {
        const angle = (index / Math.max(this.drivers.length, 1)) * Math.PI * 2;
        return {
          driver,
          x: bounds.width / 2 + Math.cos(angle) * bounds.width * 0.32 * this.scale + this.offsetX,
          y: bounds.height / 2 + Math.sin(angle) * bounds.height * 0.28 * this.scale + this.offsetY
        };
      });
    }

    const xs = driversWithPositions.map((driver) => driver.trackPosition!.x);
    const ys = driversWithPositions.map((driver) => driver.trackPosition!.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const rangeX = Math.max(1, maxX - minX);
    const rangeY = Math.max(1, maxY - minY);

    return driversWithPositions.map((driver) => ({
      driver,
      x: 60 + ((driver.trackPosition!.x - minX) / rangeX) * (bounds.width - 120) * this.scale + this.offsetX,
      y: 60 + ((driver.trackPosition!.y - minY) / rangeY) * (bounds.height - 120) * this.scale + this.offsetY
    }));
  }

  private drawFallbackTrack(context: CanvasRenderingContext2D, width: number, height: number): void {
    context.save();
    context.translate(width / 2 + this.offsetX, height / 2 + this.offsetY);
    context.scale(this.scale, this.scale);
    context.strokeStyle = 'rgba(244, 244, 242, 0.75)';
    context.lineWidth = 18;
    context.beginPath();
    context.ellipse(0, 0, width * 0.34, height * 0.28, -0.18, 0, Math.PI * 2);
    context.stroke();
    context.strokeStyle = 'rgba(16, 17, 20, 0.9)';
    context.lineWidth = 10;
    context.stroke();
    context.restore();
  }

  private drawTrail(context: CanvasRenderingContext2D, driver: DriverFrame, x: number, y: number): void {
    if (driver.trail.length === 0) {
      return;
    }

    context.save();
    context.strokeStyle = driver.teamColor;
    context.globalAlpha = 0.35;
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(x, y);
    for (const point of driver.trail.slice(-8)) {
      context.lineTo(point.x, point.y);
    }
    context.stroke();
    context.restore();
  }

  private drawDriver(context: CanvasRenderingContext2D, driver: DriverFrame, x: number, y: number): void {
    context.save();
    context.fillStyle = driver.teamColor;
    context.beginPath();
    context.arc(x, y, 14, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#101114';
    context.font = '700 10px Inter, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(driver.tla, x, y + 1);
    context.restore();
  }
}
