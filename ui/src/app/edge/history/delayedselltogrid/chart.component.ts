import { formatNumber } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DefaultTypes } from 'src/app/shared/service/defaulttypes';
import { ChannelAddress, Edge, EdgeConfig, Service, Utils } from '../../../shared/shared';
import { AbstractHistoryChart } from '../abstracthistorychart';
import { Data, TooltipItem } from './../shared';

@Component({
    selector: 'delayedselltogridgchart',
    templateUrl: '../abstracthistorychart.html'
})
export class DelayedSellToGridChartComponent extends AbstractHistoryChart implements OnInit, OnChanges {

    @Input() public period: DefaultTypes.HistoryPeriod;
    @Input() public componentId: string;

    ngOnChanges() {
        this.updateChart();
    };

    constructor(
        protected service: Service,
        protected translate: TranslateService,
        private route: ActivatedRoute,
    ) {
        super(service, translate);
    }


    ngOnInit() {
        this.spinnerId = 'delayedsellTogrid-chart';
        this.service.startSpinner(this.spinnerId);
        this.service.setCurrentComponent('', this.route);
    }

    ngOnDestroy() {
        this.unsubscribeChartRefresh()
    }

    protected updateChart() {
        this.autoSubscribeChartRefresh();
        this.service.startSpinner(this.spinnerId);
        this.loading = true;
        this.colors = [];
        this.queryHistoricTimeseriesData(this.period.from, this.period.to).then(response => {
            this.service.getConfig().then(config => {
                let meterIdActivePower = config.getComponent(this.componentId).properties['meter.id'] + '/ActivePower';
                let sellToGridPowerLimit = this.componentId + '/_PropertySellToGridPowerLimit';
                let continuousSellToGridPower = this.componentId + '/_PropertyContinuousSellToGridPower';
                let result = response.result;
                // convert labels
                let labels: Date[] = [];
                for (let timestamp of result.timestamps) {
                    labels.push(new Date(timestamp));
                }
                this.labels = labels;

                // convert datasets
                let datasets = [];

                if (meterIdActivePower in result.data) {
                    let data = result.data[meterIdActivePower].map(value => {
                        if (value == null) {
                            return null
                        } else if (value < 0) {
                            return (value * -1) / 1000;// convert to kW + positive GridSell values;
                        } else {
                            return 0;
                        }
                    });
                    datasets.push({
                        label: this.translate.instant('General.gridSell'),
                        data: data,
                        hidden: false
                    });
                    this.colors.push({
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        borderColor: 'rgba(0,0,0,1)'
                    })
                }
                if (sellToGridPowerLimit in result.data) {
                    let data = result.data[sellToGridPowerLimit].map(value => {
                        if (value == null) {
                            return null
                        } else if (value == 0) {
                            return 0;
                        } else {
                            return value / 1000; // convert to kW
                        }
                    });
                    datasets.push({
                        label: this.translate.instant('Edge.Index.Widgets.DelayedSellToGrid.sellToGridPowerLimit'),
                        data: data,
                        hidden: false,
                        borderDash: [3, 3]
                    });
                    this.colors.push({
                        backgroundColor: 'rgba(0,0,0,0)',
                        borderColor: 'rgba(0,223,0,1)',
                    })
                }
                if (continuousSellToGridPower in result.data) {
                    let data = result.data[continuousSellToGridPower].map(value => {
                        if (value == null) {
                            return null
                        } else if (value == 0) {
                            return 0;
                        } else {
                            return value / 1000; // convert to kW
                        }
                    });
                    datasets.push({
                        label: this.translate.instant('Edge.Index.Widgets.DelayedSellToGrid.continuousSellToGridPower'),
                        data: data,
                        hidden: false,
                        borderDash: [3, 3]
                    });
                    this.colors.push({
                        backgroundColor: 'rgba(0,0,0,0)',
                        borderColor: 'rgba(200,0,0,1)',
                    })
                }
                if ('_sum/EssActivePower' in result.data) {
                    /*
                     * Storage Charge
                     */
                    let effectivePower;
                    if ('_sum/ProductionDcActualPower' in result.data && result.data['_sum/ProductionDcActualPower'].length > 0) {
                        effectivePower = result.data['_sum/ProductionDcActualPower'].map((value, index) => {
                            return Utils.subtractSafely(result.data['_sum/EssActivePower'][index], value);
                        });
                    } else {
                        effectivePower = result.data['_sum/EssActivePower'];
                    }
                    let chargeData = effectivePower.map(value => {
                        if (value == null) {
                            return null
                        } else if (value < 0) {
                            return value / -1000; // convert to kW;
                        } else {
                            return 0;
                        }
                    });
                    datasets.push({
                        label: this.translate.instant('General.chargePower'),
                        data: chargeData,
                        borderDash: [10, 10]
                    });
                    this.colors.push({
                        backgroundColor: 'rgba(0,223,0,0.05)',
                        borderColor: 'rgba(0,223,0,1)',
                    })
                    /*
                     * Storage Discharge
                     */
                    let dischargeData = effectivePower.map(value => {
                        if (value == null) {
                            return null
                        } else if (value > 0) {
                            return value / 1000; // convert to kW
                        } else {
                            return 0;
                        }
                    });
                    datasets.push({
                        label: this.translate.instant('General.dischargePower'),
                        data: dischargeData,
                        borderDash: [10, 10]
                    });
                    this.colors.push({
                        backgroundColor: 'rgba(200,0,0,0.05)',
                        borderColor: 'rgba(200,0,0,1)',
                    })
                }
                this.datasets = datasets;
                this.loading = false;
                this.service.stopSpinner(this.spinnerId);
            }).catch(reason => {
                console.error(reason); // TODO error message
                this.initializeChart();
                return;
            });
        }).catch(reason => {
            console.error(reason); // TODO error message
            this.initializeChart();
            return;
        });
    }

    protected getChannelAddresses(edge: Edge, config: EdgeConfig): Promise<ChannelAddress[]> {
        return new Promise((resolve) => {
            let result: ChannelAddress[] = [
                new ChannelAddress(this.componentId, '_PropertySellToGridPowerLimit'),
                new ChannelAddress(this.componentId, '_PropertyContinuousSellToGridPower'),
                new ChannelAddress(config.getComponent(this.componentId).properties['meter.id'], 'ActivePower'),
                new ChannelAddress('_sum', 'ProductionDcActualPower'),
                new ChannelAddress('_sum', 'EssActivePower')
            ];
            resolve(result);
        })
    }

    protected setLabel() {
        let options = this.createDefaultChartOptions();
        options.scales.yAxes[0].scaleLabel.labelString = "kW";
        options.tooltips.callbacks.label = function (tooltipItem: TooltipItem, data: Data) {
            let label = data.datasets[tooltipItem.datasetIndex].label;
            let value = tooltipItem.yLabel;
            return label + ": " + formatNumber(value, 'de', '1.0-2') + " kW";
        }
        this.options = options;
    }

    public getChartHeight(): number {
        return window.innerHeight / 1.3;
    }
}