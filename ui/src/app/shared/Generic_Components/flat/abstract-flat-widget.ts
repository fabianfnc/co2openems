import { Directive, Inject, Input, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ChannelAddress, CurrentData, Edge, EdgeConfig, Service, Websocket } from "src/app/shared/shared";
import { v4 as uuidv4 } from 'uuid';

@Directive()
export abstract class AbstractFlatWidget implements OnInit, OnDestroy {

    @Input()
    protected componentId: string;

    /**
     * True after this.edge, this.config and this.component are set.
     */
    public isInitialized: boolean = false;
    public edge: Edge = null;
    public config: EdgeConfig = null;
    public component: EdgeConfig.Component = null;
    public stopOnDestroy: Subject<void> = new Subject<void>();

    private selector: string = uuidv4();

    constructor(
        @Inject(Websocket) protected websocket: Websocket,
        @Inject(ActivatedRoute) protected route: ActivatedRoute,
        @Inject(Service) protected service: Service,
        @Inject(ModalController) protected modalController: ModalController,
        @Inject(TranslateService) protected translate: TranslateService
    ) {
    }

    public ngOnInit() {
        this.service.setCurrentComponent('', this.route).then(edge => {
            this.service.getConfig().then(config => {
                // store important variables publically
                this.edge = edge;
                this.config = config;
                this.component = config.components[this.componentId];

                // announce initialized
                this.isInitialized = true;

                // get the channel addresses that should be subscribed
                let channelAddresses: ChannelAddress[] = this.getChannelAddresses();
                let channelIds = this.getChannelIds();
                for (let channelId of channelIds) {
                    channelAddresses.push(new ChannelAddress(this.componentId, channelId));
                }
                if (channelAddresses.length != 0) {
                    this.edge.subscribeChannels(this.websocket, this.selector, channelAddresses);
                }

                // call onCurrentData() with latest data
                edge.currentData.pipe(takeUntil(this.stopOnDestroy)).subscribe(currentData => {
                    let allComponents = {};
                    let thisComponent = {};
                    for (let channelAddress of channelAddresses) {
                        let ca = channelAddress.toString();
                        allComponents[ca] = currentData.channel[ca];
                        if (channelAddress.componentId === this.componentId) {
                            thisComponent[channelAddress.channelId] = currentData.channel[ca];
                        }
                    }
                    this.onCurrentData({ thisComponent: thisComponent, allComponents: allComponents });
                });
            });
        });
    };

    public ngOnDestroy() {
        // Unsubscribe from OpenEMS
        this.edge.unsubscribeChannels(this.websocket, this.selector);

        // Unsubscribe from CurrentData subject
        this.stopOnDestroy.next();
        this.stopOnDestroy.complete();
    }

    /**
     * Called on every new data.
     * 
     * @param currentData new data for the subscribed Channel-Addresses
     */
    protected onCurrentData(currentData: CurrentData) {
    }

    /**
     * Gets the ChannelAddresses that should be subscribed.
     */
    protected getChannelAddresses(): ChannelAddress[] {
        return [];
    }

    /**
     * Gets the ChannelIds of the current Component that should be subscribed.
     */
    protected getChannelIds(): string[] {
        return [];
    }
}