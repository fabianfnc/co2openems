import { AbstractSection, EnergyFlow, Ratio, SvgEnergyFlow, SvgSquare, SvgSquarePosition } from './abstractsection.component';
import { Component, OnDestroy } from '@angular/core';
import { DefaultTypes } from '../../../../../shared/service/defaulttypes';
import { Service, Utils } from '../../../../../shared/shared';
import { TranslateService } from '@ngx-translate/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { UnitvaluePipe } from 'src/app/shared/pipe/unitvalue/unitvalue.pipe';

@Component({
    selector: '[consumptionsection]',
    templateUrl: './consumption.component.html',
    animations: [
        trigger('Consumption', [
            state('show', style({
                opacity: 0.1,
                transform: 'translateX(0%)',
            })),
            state('hide', style({
                opacity: 0.6,
                transform: 'translateX(17%)'
            })),
            transition('show => hide', animate('650ms ease-out')),
            transition('hide => show', animate('0ms ease-in'))
        ])
    ]
})
export class ConsumptionSectionComponent extends AbstractSection implements OnDestroy {

    private unitpipe: UnitvaluePipe;
    private showAnimation: boolean = false;
    private animationTrigger: boolean = false;
    // animation variable to stop animation on destroy
    private startAnimation = null;

    constructor(
        unitpipe: UnitvaluePipe,
        translate: TranslateService,
        service: Service,
    ) {
        super('General.consumption', "right", "#FDC507", translate, service, "Consumption");
        this.unitpipe = unitpipe;
    }

    ngOnInit() {
        this.adjustFillRefbyBrowser();
    }

    toggleAnimation() {
        this.startAnimation = setInterval(() => {
            this.showAnimation = !this.showAnimation;
        }, this.animationSpeed);
        this.animationTrigger = true;
    }

    get stateName() {
        return this.showAnimation ? 'show' : 'hide'
    }

    protected getStartAngle(): number {
        return 46;
    }

    protected getEndAngle(): number {
        return 134;
    }

    protected getRatioType(): Ratio {
        return 'Only Positive [0,1]';
    }

    protected _updateCurrentData(sum: DefaultTypes.Summary): void {
        let arrowIndicate: number;
        // only reacts to kW values (50 W => 0.1 kW rounded)
        if (sum.consumption.activePower > 49) {
            if (!this.animationTrigger) {
                this.toggleAnimation();
            }
            arrowIndicate = Utils.divideSafely(sum.consumption.activePower, sum.system.totalPower);
        } else {
            arrowIndicate = 0;
        }
        super.updateSectionData(
            sum.consumption.activePower,
            sum.consumption.powerRatio,
            arrowIndicate);
    }

    protected getSquarePosition(square: SvgSquare, innerRadius: number): SvgSquarePosition {
        let x = innerRadius - 5 - square.length;
        let y = (square.length / 2) * (-1);
        return new SvgSquarePosition(x, y);
    }
    protected getImagePath(): string {
        return "consumption.png";
    }

    protected getValueText(value: number): string {
        if (value == null || Number.isNaN(value)) {
            return "";
        }
        return this.unitpipe.transform(value, 'kW')
    }

    protected initEnergyFlow(radius: number): EnergyFlow {
        return new EnergyFlow(radius, { x1: "0%", y1: "50%", x2: "100%", y2: "50%" });
    }

    protected setElementHeight() {
        this.square.valueText.y = this.square.valueText.y - (this.square.valueText.y * 0.3)
        this.square.image.y = this.square.image.y - (this.square.image.y * 0.3)
    }

    protected getSvgEnergyFlow(ratio: number, radius: number): SvgEnergyFlow {
        let v = Math.abs(ratio);
        let r = radius;
        let p = {
            topLeft: { x: v, y: v * -1 },
            middleLeft: { x: 0, y: 0 },
            bottomLeft: { x: v, y: v },
            topRight: { x: r, y: v * -1 },
            bottomRight: { x: r, y: v },
            middleRight: { x: r - v, y: 0 }
        }
        if (ratio > 0) {
            // towards right
            p.topRight.x = p.topRight.x - v;
            p.middleRight.x = p.middleRight.x + v;
            p.bottomRight.x = p.bottomRight.x - v;
            p.middleLeft.x = p.topLeft.x + v;
        }
        return p;
    }

    protected getSvgAnimationEnergyFlow(ratio: number, radius: number): SvgEnergyFlow {
        let v = Math.abs(ratio);
        let r = radius;
        let animationWidth = (r * -1) - v;
        let p = {
            topLeft: { x: v, y: v * -1 },
            middleLeft: { x: 0, y: 0 },
            bottomLeft: { x: v, y: v },
            topRight: { x: r, y: v * -1 },
            bottomRight: { x: r, y: v },
            middleRight: { x: r - v, y: 0 }
        }
        if (ratio > 0) {
            // towards right
            p.topRight.x = p.topLeft.x + animationWidth * 0.2;
            p.middleRight.x = p.middleLeft.x + animationWidth * 0.2 + 2 * v;
            p.bottomRight.x = p.bottomLeft.x + animationWidth * 0.2;
            p.middleLeft.x = p.middleRight.x - animationWidth * 0.2;
        } else {
            p = null;
        }
        return p;
    }

    ngOnDestroy() {
        clearInterval(this.startAnimation);
    }
}
