import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsumptionSectionComponent } from './section/consumption.component';
import { CurrentData } from '../../../../shared/edge/currentdata';
import { debounceTime, delay, takeUntil } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
import { GridSectionComponent } from './section/grid.component';
import { ProductionSectionComponent } from './section/production.component';
import { Service } from 'src/app/shared/shared';
import { StorageSectionComponent } from './section/storage.component';

@Component({
  selector: 'energymonitor-chart',
  templateUrl: './chart.component.html'
})
export class EnergymonitorChartComponent implements OnInit, OnDestroy {

  @ViewChild(ConsumptionSectionComponent, { static: true })
  public consumptionSection: ConsumptionSectionComponent;

  @ViewChild(GridSectionComponent, { static: true })
  public gridSection: GridSectionComponent;

  @ViewChild(ProductionSectionComponent, { static: true })
  public productionSection: ProductionSectionComponent;

  @ViewChild(StorageSectionComponent, { static: true })
  public storageSection: StorageSectionComponent;

  @ViewChild('energymonitorChart', { static: true })
  private chartDiv: ElementRef;

  @Input()
  set currentData(currentData: CurrentData) {
    this.service.stopSpinner("live-energymonitor");
    this.updateCurrentData(currentData);
  }

  public translation: string;
  public width: number;
  public height: number;
  public gridMode: number;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private service: Service,
  ) { }

  ngOnInit() {
    this.service.startSpinner("live-energymonitor");
    // make sure chart is redrawn in the beginning and on window resize
    setTimeout(() => this.updateOnWindowResize(), 500);
    const source = fromEvent(window, 'resize', null, null);
    source.pipe(takeUntil(this.ngUnsubscribe), debounceTime(200), delay(100)).subscribe(e => {
      this.updateOnWindowResize();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * This method is called on every change of values.
   */
  updateCurrentData(currentData: CurrentData) {
    /*
     * Set values for energy monitor
     */
    let summary = currentData.summary;
    [this.consumptionSection, this.gridSection, this.productionSection, this.storageSection]
      .filter(section => section != null)
      .forEach(section => {
        section.updateCurrentData(summary);
      });
  }

  /**
   * This method is called on every change of resolution of the browser window.
   */
  private updateOnWindowResize(): void {
    let size = 300;
    if (this.chartDiv.nativeElement.offsetParent) {
      size = this.chartDiv.nativeElement.offsetParent.offsetWidth - 30;
    }
    if (size > window.innerHeight) {
      size = window.innerHeight;
    }
    this.height = this.width = size;
    this.translation = `translate(${this.width / 2}, ${this.height / 2})`;
    var outerRadius = Math.min(this.width, this.height) / 2;
    var innerRadius = outerRadius - (outerRadius * 0.1378);
    // All sections from update() in section
    [this.consumptionSection, this.gridSection, this.productionSection, this.storageSection]
      .filter(section => section != null)
      .forEach(section => {
        section.updateOnWindowResize(outerRadius, innerRadius, this.height, this.width);
      });
  }

  private deg2rad(value: number): number {
    return value * (Math.PI / 180)
  }
}
