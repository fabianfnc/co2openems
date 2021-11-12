import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { Service, Utils, EdgeConfig, Edge } from '../../../../shared/shared';

@Component({
    selector: FixDigitalOutputChartOverviewComponent.SELECTOR,
    templateUrl: './fixdigitaloutputchartoverview.component.html'
})
export class FixDigitalOutputChartOverviewComponent {

    private static readonly SELECTOR = "fixdigitaloutput-chart-overview";

    public edge: Edge = null;
    public component: EdgeConfig.Component = null;

    public showTotal: boolean = null;
    public fixDigitalOutputComponents: string[] = [];

    // reference to the Utils method to access via html
    public isLastElement = Utils.isLastElement;

    constructor(
        public service: Service,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.service.setCurrentComponent('', this.route).then(edge => {
            this.service.getConfig().then(config => {
                this.edge = edge;
                this.component = config.getComponent(this.route.snapshot.params.componentId);
                config.getComponentsByFactory('Controller.Io.FixDigitalOutput').forEach(component => {
                    this.fixDigitalOutputComponents.push(component.id)
                })
                if (this.fixDigitalOutputComponents.length > 1) {
                    this.showTotal = false;
                } else if (this.fixDigitalOutputComponents.length == 1) {
                    this.showTotal = null;
                }
            })
        })

    }

    onNotifyTotal(showTotal: boolean): void {
        this.showTotal = showTotal;
    }
}