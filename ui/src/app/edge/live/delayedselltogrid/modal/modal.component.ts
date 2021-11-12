import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Service, EdgeConfig, Edge, Websocket } from '../../../../shared/shared';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: DelayedSellToGridModalComponent.SELECTOR,
    templateUrl: './modal.component.html'
})
export class DelayedSellToGridModalComponent {

    @Input() component: EdgeConfig.Component;
    @Input() edge: Edge;

    private static readonly SELECTOR = "delayedselltogrid-modal";

    public formGroup: FormGroup;
    public loading: boolean = false;

    constructor(
        public formBuilder: FormBuilder,
        public modalCtrl: ModalController,
        public service: Service,
        public translate: TranslateService,
        public websocket: Websocket,
    ) { }

    ngOnInit() {
        this.formGroup = this.formBuilder.group({
            continuousSellToGridPower: new FormControl(this.component.properties.continuousSellToGridPower, Validators.compose([
                Validators.pattern('^(?:[1-9][0-9]*|0)$'),
                Validators.required
            ])),
            sellToGridPowerLimit: new FormControl(this.component.properties.sellToGridPowerLimit, Validators.compose([
                Validators.pattern('^(?:[1-9][0-9]*|0)$'),
                Validators.required
            ]))
        })
    }

    applyChanges() {
        if (this.edge != null) {
            if (this.edge.roleIsAtLeast('owner')) {
                let continuousSellToGridPower = this.formGroup.controls['continuousSellToGridPower'];
                let sellToGridPowerLimit = this.formGroup.controls['sellToGridPowerLimit'];
                if (continuousSellToGridPower.valid && sellToGridPowerLimit.valid) {
                    if (sellToGridPowerLimit.value > continuousSellToGridPower.value) {
                        let updateComponentArray = [];
                        Object.keys(this.formGroup.controls).forEach((element, index) => {
                            if (this.formGroup.controls[element].dirty) {
                                updateComponentArray.push({ name: Object.keys(this.formGroup.controls)[index], value: this.formGroup.controls[element].value })
                            }
                        })
                        this.loading = true;
                        this.edge.updateComponentConfig(this.websocket, this.component.id, updateComponentArray).then(() => {
                            this.component.properties.continuousSellToGridPower = continuousSellToGridPower.value;
                            this.component.properties.sellToGridPowerLimit = sellToGridPowerLimit.value;
                            this.loading = false;
                            this.service.toast(this.translate.instant('General.changeAccepted'), 'success');
                        }).catch(reason => {
                            continuousSellToGridPower.setValue(this.component.properties.continuousSellToGridPower);
                            sellToGridPowerLimit.setValue(this.component.properties.sellToGridPowerLimit);
                            this.loading = false;
                            this.service.toast(this.translate.instant('General.changeFailed') + '\n' + reason.error.message, 'danger');
                            console.warn(reason);
                        })
                        this.formGroup.markAsPristine()
                    } else {
                        this.service.toast(this.translate.instant('Edge.Index.Widgets.DelayedSellToGrid.relationError'), 'danger');
                    }
                } else {
                    this.service.toast(this.translate.instant('General.inputNotValid'), 'danger');
                }
            } else {
                this.service.toast(this.translate.instant('General.insufficientRights'), 'danger');
            }
        }
    }
}