import { DecimalPipe } from '@angular/common';
import { ChartData, ChartLegendLabelItem, ChartTooltipItem } from 'chart.js';
import { differenceInDays, differenceInMinutes, endOfDay, startOfDay } from 'date-fns';
import { QueryHistoricTimeseriesDataResponse } from 'src/app/shared/jsonrpc/response/queryHistoricTimeseriesDataResponse';
import { ChannelAddress, Service } from 'src/app/shared/shared';

export interface Dataset {
    label: string;
    data: number[];
    hidden: boolean;
}

export const EMPTY_DATASET = [{
    label: "no Data available",
    data: [],
    hidden: false
}];

export type Data = {
    labels: Date,
    datasets: {
        backgroundColor: string,
        borderColor: string,
        data: number[],
        label: string,
        _meta: {}
    }[]
}

export type TooltipItem = {
    datasetIndex: number,
    index: number,
    x: number,
    xLabel: Date,
    value: number,
    y: number,
    yLabel: number
}

export type ChartOptions = {
    layout?: {
        padding: {
            left: number,
            right: number,
            top: number,
            bottom: number
        }
    }
    responsive?: boolean,
    maintainAspectRatio: boolean,
    legend: {
        onClick?(event: MouseEvent, legendItem: ChartLegendLabelItem): void
        labels: {
            generateLabels?(chart: Chart): ChartLegendLabelItem[],
            filter?(legendItem: ChartLegendLabelItem, data: ChartData): any,
        },
        position: "bottom"
    },
    elements: {
        point: {
            radius: number,
            hitRadius: number,
            hoverRadius: number
        },
        line: {
            borderWidth: number,
            tension: number
        },
        rectangle: {
            borderWidth: number,
        }
    },
    hover: {
        mode: string,
        intersect: boolean
    },
    scales: {
        yAxes: [{
            id?: string,
            position: string,
            scaleLabel: {
                display: boolean,
                labelString: string,
                padding?: number,
                fontSize?: number
            },
            gridLines?: {
                display: boolean
            },
            ticks: {
                beginAtZero: boolean,
                max?: number,
                padding?: number,
                stepSize?: number,
                callback?(value: number | string, index: number, values: number[] | string[]): string | number | null | undefined;
            }
        }],
        xAxes: [{
            bounds?: string,
            offset?: boolean,
            stacked: boolean,
            type: "time",
            time: {
                stepSize?: number,
                unit?: string,
                minUnit: string,
                displayFormats: {
                    millisecond: string,
                    second: string,
                    minute: string,
                    hour: string,
                    day: string,
                    week: string,
                    month: string,
                    quarter: string,
                    year: string
                }
            },
            ticks: {
                source?: string,
                maxTicksLimit?: number
            }
        }]
    },
    tooltips: {
        mode: string,
        intersect: boolean,
        axis: string,
        itemSort?(itemA: ChartTooltipItem, itemB: ChartTooltipItem, data?: ChartData): number,
        callbacks: {
            label?(tooltipItem: TooltipItem, data: Data): string,
            title?(tooltipItems: TooltipItem[], data: Data): string,
            afterTitle?(item: ChartTooltipItem[], data: ChartData): string | string[],
            footer?(item: ChartTooltipItem[], data: ChartData): string | string[]
        }
    }
}

export const DEFAULT_TIME_CHART_OPTIONS: ChartOptions = {
    maintainAspectRatio: false,
    legend: {
        labels: {},
        position: 'bottom'
    },
    elements: {
        point: {
            radius: 0,
            hitRadius: 0,
            hoverRadius: 0
        },
        line: {
            borderWidth: 2,
            tension: 0.1
        },
        rectangle: {
            borderWidth: 2,
        }
    },
    hover: {
        mode: 'point',
        intersect: true
    },
    scales: {
        yAxes: [{
            position: 'left',
            scaleLabel: {
                display: true,
                labelString: ""
            },
            ticks: {
                beginAtZero: true
            }
        }],
        xAxes: [{
            ticks: {},
            stacked: false,
            type: 'time',
            time: {
                minUnit: 'hour',
                displayFormats: {
                    millisecond: 'SSS [ms]',
                    second: 'HH:mm:ss a', // 17:20:01
                    minute: 'HH:mm', // 17:20
                    hour: 'HH:[00]', // 17:20
                    day: 'DD', // Sep 04 2015
                    week: 'll', // Week 46, or maybe "[W]WW - YYYY" ?
                    month: 'MM', // September
                    quarter: '[Q]Q - YYYY', // Q3 - 2015
                    year: 'YYYY' // 2015,
                }
            },
        }]
    },
    tooltips: {
        mode: 'index',
        intersect: false,
        axis: 'x',
        callbacks: {
            title(tooltipItems: TooltipItem[], data: Data): string {
                let date = new Date(tooltipItems[0].xLabel);
                return date.toLocaleDateString() + " " + date.toLocaleTimeString();
            }
        }
    }
};

export function calculateActiveTimeOverPeriod(channel: ChannelAddress, queryResult: QueryHistoricTimeseriesDataResponse['result']) {
    let result;
    // TODO get locale dynamically
    let decimalPipe = new DecimalPipe('de-DE')
    let startDate = startOfDay(new Date(queryResult.timestamps[0]));
    let endDate = endOfDay(new Date(queryResult.timestamps[queryResult.timestamps.length - 1]));
    let activeSum = 0;
    queryResult.data[channel.toString()].forEach(value => {
        activeSum += value;
    });
    let activePercent = activeSum / queryResult.timestamps.length;
    let activeTimeMinutes = differenceInMinutes(endDate, startDate) * activePercent;
    let activeTimeHours = (activeTimeMinutes / 60).toFixed(1);
    if (activeTimeMinutes > 59) {
        activeTimeHours = decimalPipe.transform(activeTimeHours, '1.0-1');
        result = activeTimeHours + ' h';
        // if activeTimeHours is XY,0, removes the ',0' from activeTimeOverPeriod string
        activeTimeHours.split('').forEach((letter, index) => {
            if (index == activeTimeHours.length - 1 && letter == "0") {
                result = activeTimeHours.slice(0, -2) + ' h';
            }
        });
    } else {
        result = decimalPipe.transform(activeTimeMinutes.toString(), '1.0-0') + ' m';
    }
    return result;
};

/**
   * Calculates resolution from passed Dates for queryHistoricTime-SeriesData und -EnergyPerPeriod 
   * 
   * @param service the Service
   * @param fromDate the From-Date
   * @param toDate the To-Date
   * @returns resolution
   */
export function calculateResolution(service: Service, fromDate: Date, toDate: Date): number {
    let days = Math.abs(differenceInDays(toDate, fromDate));

    if (days <= 1) {
        return 5 * 60; // 5 Minutes

    } else if (days == 2) {
        if (service.isSmartphoneResolution) {
            return 24 * 60 * 60; // 1 Day
        } else {
            return 10 * 60; // 10 Minutes
        }

    } else if (days <= 4) {
        if (service.isSmartphoneResolution) {
            return 24 * 60 * 60; // 1 Day
        } else {
            return 60 * 60; // 1 Hour
        }

    } else if (days <= 6) {
        // >> show Hours
        // Smartphone - Week View show one bar for every Day
        if (service.isSmartphoneResolution == true) {
            return 24 * 60 * 60; // 1 Day
        } else if (service.periodString == 'week') {
            return 60 * 60; // 1 Hour
        } else {
            return 12 * 60 * 60; // 12 Hour
        }

    } else if (days <= 31 && service.isSmartphoneResolution) {
        // Smartphone-View: show 31 days in daily view
        return 24 * 60 * 60; // 1 Day

    } else if (days <= 144) {
        // >> show Days
        if (service.isSmartphoneResolution == true) {
            return 31 * 24 * 60 * 60; // 1 Month
        } else {
            return 24 * 60 * 60; // 1 Day
        }

    } else {
        // >> show Months
        return 31 * 24 * 60 * 60; // 1 Month
    }
}

/**
  * Returns true if Chart Label should be visible. Defaults to to true.
  * 
  * Compares only the first part of the label string - without a value or unit.
  * 
  * @param label the Chart label
  * @param orElse the default, in case no value was stored yet in Session-Storage
  * @returns true for visible labels; hidden otherwise
  */
export function isLabelVisible(label: string, orElse?: boolean): boolean {
    let labelWithoutUnit = "LABEL_" + label.split(" ")[0];
    let value = sessionStorage.getItem(labelWithoutUnit);
    if (orElse != null && value == null) {
        return orElse;
    } else {
        return value !== 'false';
    }
}

/**
 * Stores if the Label should be visible or hidden in Session-Storage.
 * 
 * @param label the Chart label
 * @param visible true to set the Label visibile; false to hide ite
 */
export function setLabelVisible(label: string, visible: boolean | null): void {
    if (visible == null) {
        return;
    }
    let labelWithoutUnit = "LABEL_" + label.split(" ")[0];
    sessionStorage.setItem(labelWithoutUnit, visible ? 'true' : 'false');
}
