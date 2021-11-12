import { Data } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ChartDataSets } from 'chart.js';
import { addDays, addMonths, differenceInDays, differenceInMonths } from 'date-fns';
import { queryHistoricTimeseriesEnergyPerPeriodRequest } from 'src/app/shared/jsonrpc/request/queryHistoricTimeseriesEnergyPerPeriodRequest';
import { queryHistoricTimeseriesEnergyPerPeriodResponse } from 'src/app/shared/jsonrpc/response/queryHistoricTimeseriesEnergyPerPeriodResponse';
import { JsonrpcResponseError } from "../../shared/jsonrpc/base";
import { QueryHistoricTimeseriesDataRequest } from "../../shared/jsonrpc/request/queryHistoricTimeseriesDataRequest";
import { QueryHistoricTimeseriesDataResponse } from "../../shared/jsonrpc/response/queryHistoricTimeseriesDataResponse";
import { ChannelAddress, Edge, EdgeConfig, Service, Utils } from "../../shared/shared";
import { calculateResolution, ChartOptions, DEFAULT_TIME_CHART_OPTIONS, EMPTY_DATASET, TooltipItem } from './shared';

// NOTE: Auto-refresh of widgets is currently disabled to reduce server load
export abstract class AbstractHistoryChart {

    public loading: boolean = true;
    public spinnerId: string = "";
    protected edge: Edge | null = null;

    //observable is used to fetch new chart data every 10 minutes
    // private refreshChartData = interval(600000);

    //observable is used to refresh chart height dependend on the window size
    // private refreshChartHeight = fromEvent(window, 'resize', null, null);

    // private ngUnsubscribe: Subject<void> = new Subject<void>();

    public labels: Date[] = [];
    public datasets: ChartDataSets[] = EMPTY_DATASET;
    public options: ChartOptions | null = null;
    public colors = []
    // prevents subscribing more than once
    protected hasSubscribed: boolean = false;

    // Colors for Phase 1-3
    protected phase1Color = {
        backgroundColor: 'rgba(255,127,80,0.05)',
        borderColor: 'rgba(255,127,80,1)',
    }
    protected phase2Color = {
        backgroundColor: 'rgba(0,0,255,0.1)',
        borderColor: 'rgba(0,0,255,1)',
    }
    protected phase3Color = {
        backgroundColor: 'rgba(128,128,0,0.1)',
        borderColor: 'rgba(128,128,0,1)',
    }

    constructor(
        protected service: Service,
        protected translate: TranslateService
    ) {
    }

    /**
     * Gets the ChannelAddresses that should be queried.
     * 
     * @param edge the current Edge
     * @param config the EdgeConfig
     */
    protected abstract getChannelAddresses(edge: Edge, config: EdgeConfig): Promise<ChannelAddress[]>;


    /**
     * Sends the Historic Timeseries Data Query and makes sure the result is not empty.
     * 
     * @param fromDate the From-Date
     * @param toDate   the To-Date
     * @param edge     the current Edge
     * @param ws       the websocket
     */
    protected queryHistoricTimeseriesData(fromDate: Date, toDate: Date): Promise<QueryHistoricTimeseriesDataResponse> {

        // TODO should be removed, edge delivers too much data 
        let newDate = (this.service.periodString == 'year' ? addMonths(fromDate, 1) : this.service.periodString == 'month' ? addDays(fromDate, 1) : fromDate);
        let resolution = calculateResolution(this.service, fromDate, toDate);
        return new Promise((resolve, reject) => {
            this.service.getCurrentEdge().then(edge => {
                this.service.getConfig().then(config => {
                    this.setLabel(config);
                    this.getChannelAddresses(edge, config).then(channelAddresses => {
                        let request = new QueryHistoricTimeseriesDataRequest(newDate, toDate, channelAddresses, resolution);
                        edge.sendRequest(this.service.websocket, request).then(response => {
                            let result = (response as QueryHistoricTimeseriesDataResponse).result;
                            if (Object.keys(result.data).length != 0 && Object.keys(result.timestamps).length != 0) {
                                resolve(response as QueryHistoricTimeseriesDataResponse);
                            } else {
                                reject(new JsonrpcResponseError(response.id, { code: 0, message: "Result was empty" }));
                            }
                        }).catch(reason => reject(reason));
                    }).catch(reason => reject(reason));
                })
            });
        });
    }

    /**
     * Sends the Historic Timeseries Energy per Period Query and makes sure the result is not empty.
     * 
     * @param fromDate the From-Date
     * @param toDate   the To-Date
     * @param channelAddresses       the Channel-Addresses
     */
    protected queryHistoricTimeseriesEnergyPerPeriod(fromDate: Date, toDate: Date, channelAddresses: ChannelAddress[]): Promise<queryHistoricTimeseriesEnergyPerPeriodResponse> {

        // TODO should be removed, edge delivers too much data 
        let newDate = this.service.periodString == 'year' ? addMonths(fromDate, 1) : addDays(fromDate, 1)
        let resolution = calculateResolution(this.service, fromDate, toDate);
        return new Promise((resolve, reject) => {
            this.service.getCurrentEdge().then(edge => {
                this.service.getConfig().then(config => {

                    edge.sendRequest(this.service.websocket, new queryHistoricTimeseriesEnergyPerPeriodRequest(newDate, toDate, channelAddresses, resolution)).then(response => {
                        let result = (response as QueryHistoricTimeseriesDataResponse).result;

                        if (Object.keys(result).length != 0) {
                            resolve(response as queryHistoricTimeseriesEnergyPerPeriodResponse);
                        } else {
                            reject(new JsonrpcResponseError(response.id, { code: 0, message: "Result was empty" }));
                        }
                    }).catch(reason => reject(reason));
                })
            });
        });
    }

    /**
     * Generates a Tooltip Title string from a 'fromDate' and 'toDate'.
     * 
     * @param fromDate the From-Date
     * @param toDate the To-Date 
     * @param date Date from TooltipItem
     * @returns period for Tooltip Header
     */
    protected toTooltipTitle(fromDate: Date, toDate: Date, date: Date): string {
        let resolution = calculateResolution(this.service, fromDate, toDate);
        if (resolution >= (31 * 24 * 60 * 60)) {
            // Yearly view
            return date.toLocaleDateString('default', { month: 'long' });

        } else if (resolution >= (24 * 60 * 60)) {
            // Monthly view
            return date.toLocaleDateString('default', { day: '2-digit', month: 'long' });

        } else {
            // Default
            return date.toLocaleString('default', { day: '2-digit', month: '2-digit', year: '2-digit', }) + ' ' + date.toLocaleTimeString('default', { hour12: false, hour: '2-digit', minute: '2-digit' });
        }
    }

    protected createDefaultChartOptions(): ChartOptions {
        let options = <ChartOptions>Utils.deepCopy(DEFAULT_TIME_CHART_OPTIONS);

        // Overwrite TooltipsTitle
        options.tooltips.callbacks.title = (tooltipItems: TooltipItem[], data: Data): string => {
            let date = new Date(tooltipItems[0].xLabel);
            return this.toTooltipTitle(this.service.historyPeriod.from, this.service.historyPeriod.to, date);
        }

        //x-axis
        if (differenceInMonths(this.service.historyPeriod.to, this.service.historyPeriod.from) > 1) {
            options.scales.xAxes[0].time.unit = "month";
        } else if (differenceInDays(this.service.historyPeriod.to, this.service.historyPeriod.from) >= 5 && differenceInMonths(this.service.historyPeriod.to, this.service.historyPeriod.from) <= 1) {
            options.scales.xAxes[0].time.unit = "day";
        } else {
            options.scales.xAxes[0].time.unit = "hour";
        }
        return options
    }

    /**
     * checks if chart is allowed to be refreshed
     * 
     */
    // protected checkAllowanceChartRefresh(): boolean {
    //     let currentDate = new Date();
    //     let allowRefresh: boolean = false;
    //     if (isAfter(this.service.historyPeriod.to, currentDate) || currentDate.getDate() == this.service.historyPeriod.from.getDate()) {
    //         allowRefresh = true;
    //     } else {
    //         allowRefresh = false;
    //     }
    //     return allowRefresh;
    // }

    /**
     * Subscribe to Chart Refresh if allowed
     * Unsubscribe to Chart Refresh if necessary
     */
    protected autoSubscribeChartRefresh() {
        // XXX disabled to reduce server load

        // if (this.hasSubscribed == false && this.checkAllowanceChartRefresh() == true) {
        //     if (this.ngUnsubscribe.isStopped == true) {
        //         this.ngUnsubscribe.isStopped = false;
        //     }
        //     this.refreshChartData.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
        //         this.updateChart();
        //     })
        //     this.refreshChartHeight.pipe(takeUntil(this.ngUnsubscribe), debounceTime(200), delay(100)).subscribe(() => {
        //         this.getChartHeight();
        //     });
        //     this.hasSubscribed = true;
        // } else if (this.hasSubscribed == true && this.checkAllowanceChartRefresh() == false) {
        //     this.unsubscribeChartRefresh();
        // }
    }

    /**
     * Unsubscribes to 10 minute Interval Observable and Window Resize Observable
     */
    protected unsubscribeChartRefresh() {
        // XXX disabled to reduce server load

        // this.hasSubscribed = false;
        // this.ngUnsubscribe.next();
        // this.ngUnsubscribe.complete();
    }

    /**
     * Sets the Label of Chart
     */
    protected abstract setLabel(config: EdgeConfig)

    /**
     * Updates and Fills the Chart
     */
    protected abstract updateChart()

    /**
     * Initializes empty chart on error
     * @param spinnerSelector to stop spinner
     */
    protected initializeChart() {
        EMPTY_DATASET[0].label = this.translate.instant('Edge.History.noData')
        this.datasets = EMPTY_DATASET;
        this.labels = [];
        this.loading = false;
        this.service.stopSpinner(this.spinnerId);
    }

    /**
     * Sets Chart Height
     */
    protected abstract getChartHeight()
}