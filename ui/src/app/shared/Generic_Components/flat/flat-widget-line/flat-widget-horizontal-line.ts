import { Component, Input } from "@angular/core";

/**
 * Shows a horizontal line on all but the last entry of a flat widget.
 */
@Component({
    selector: 'oe-flat-widget-horizontal-line',
    templateUrl: './flat-widget-horizontal-line.html'
})
export class FlatWidgetHorizontalLine {
    /** Components-Array to iterate over */
    @Input() components: any[];
    /** index is an iterator */
    @Input() index: number;
}