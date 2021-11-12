import { ActivatedRoute } from '@angular/router';
import { Edge, Service, Websocket, EdgeConfig } from '../../../shared/shared';
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CompensationModalComponent } from './modal/modal.component';

@Component({
    selector: 'compensation',
    templateUrl: './compensation.component.html'
})
export class CompensationComponent {

    private static readonly SELECTOR = "compensation";

    public config: EdgeConfig = null;
    public edge: Edge = null;

    constructor(
        private route: ActivatedRoute,
        private websocket: Websocket,
        public modalCtrl: ModalController,
        public service: Service,
    ) { }

    ngOnInit() {
        this.service.setCurrentComponent('', this.route).then(edge => {
            this.edge = edge;
            this.service.getConfig().then(config => {
                this.config = config;
            })
        })
    };

    ngOnDestroy() {
        if (this.edge != null) {
            this.edge.unsubscribeChannels(this.websocket, CompensationComponent.SELECTOR);
        }
    }

    async presentModal() {
        const modal = await this.modalCtrl.create({
            component: CompensationModalComponent,
            componentProps: {
                edge: this.edge,
                config: this.config
            }
        });
        return await modal.present();
    }
}