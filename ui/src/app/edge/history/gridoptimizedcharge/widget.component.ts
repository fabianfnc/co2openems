import { AbstractHistoryWidget } from '../abstracthistorywidget';
import { ActivatedRoute } from '@angular/router';
import { ChannelAddress, Edge, EdgeConfig, Service } from '../../../shared/shared';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DefaultTypes } from 'src/app/shared/service/defaulttypes';

@Component({
    selector: GridOptimizedChargeWidgetComponent.SELECTOR,
    templateUrl: './widget.component.html'
})
export class GridOptimizedChargeWidgetComponent extends AbstractHistoryWidget implements OnInit, OnChanges {

    @Input() public period: DefaultTypes.HistoryPeriod;
    @Input() public componentId: string;

    private static readonly SELECTOR = "gridOptimizedChargeWidget";

    public component: EdgeConfig.Component = null;

    public activeTimeSellToGridLimit: number | null = null;
    public activeTimeDelayCharge: number | null = null;
    public activeTimeNoChargeLimit: number | null = null;

    public edge: Edge = null;

    constructor(
        public service: Service,
        private route: ActivatedRoute,
    ) {
        super(service);
    }

    ngOnInit() {
        this.service.setCurrentComponent('', this.route).then(edge => {
            this.edge = edge;
            this.service.getConfig().then(config => {
                this.component = config.getComponent(this.componentId);
            });
        });
    }

    ngOnDestroy() {
        this.unsubscribeWidgetRefresh()
    }

    ngOnChanges() {
        this.updateValues();
    };

    protected updateValues() {
        this.service.getConfig().then(config => {
            this.getChannelAddresses(this.edge, config).then(channels => {
                this.service.queryEnergy(this.period.from, this.period.to, channels).then(response => {
                    let result = response.result;

                    if (this.componentId + '/DelayChargeTime' in result.data) {
                        this.activeTimeDelayCharge = result.data[this.componentId + '/DelayChargeTime'];
                    }

                    if (this.componentId + '/SellToGridLimitTime' in result.data) {
                        this.activeTimeSellToGridLimit = result.data[this.componentId + '/SellToGridLimitTime'];
                    }

                    if (this.componentId + '/NoLimitationTime' in result.data) {
                        this.activeTimeNoChargeLimit = result.data[this.componentId + '/NoLimitationTime'];
                    }
                })
            });
        })
    }

    protected getChannelAddresses(edge: Edge, config: EdgeConfig): Promise<ChannelAddress[]> {
        return new Promise((resolve) => {
            let channeladdresses = [
                new ChannelAddress(this.componentId, 'DelayChargeTime'),
                new ChannelAddress(this.componentId, 'SellToGridLimitTime'),
                new ChannelAddress(this.componentId, 'NoLimitationTime'),
            ];
            resolve(channeladdresses);
        });
    }
}