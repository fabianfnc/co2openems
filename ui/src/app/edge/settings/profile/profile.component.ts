import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CategorizedComponents } from 'src/app/shared/edge/edgeconfig';
import { ComponentJsonApiRequest } from 'src/app/shared/jsonrpc/request/componentJsonApiRequest';
import { Base64PayloadResponse } from 'src/app/shared/jsonrpc/response/base64PayloadResponse';
import { environment } from '../../../../environments';
import { ChannelAddress, Edge, EdgeConfig, Service, Utils } from '../../../shared/shared';
import { ChannelExportXlsxRequest } from './channelexport/channelExportXlsxRequest';
import { GetModbusProtocolExportXlsxRequest } from './modbusapi/getModbusProtocolExportXlsxRequest';

@Component({
  selector: ProfileComponent.SELECTOR,
  templateUrl: './profile.component.html'
})
export class ProfileComponent {

  private static readonly SELECTOR = "profile";

  public environment = environment;

  public edge: Edge = null;
  public config: EdgeConfig = null;
  public subscribedChannels: ChannelAddress[] = [];

  public components: CategorizedComponents[];

  constructor(
    private service: Service,
    private route: ActivatedRoute,
    public popoverController: PopoverController,
    private translate: TranslateService,
  ) { }

  ionViewWillEnter() {
    this.service.setCurrentComponent(this.translate.instant('Edge.Config.Index.systemProfile'), this.route).then(edge => {
      this.edge = edge;
      this.service.getConfig().then(config => {
        this.config = config;
        let categorizedComponentIds: string[] = ["_componentManager", "_cycle", "_meta", "_power", "_sum", "_predictorManager", "_host", "_evcsSlowPowerIncreaseFilter"]
        this.components = config.listActiveComponents(categorizedComponentIds);
      })
    });
  }

  public getModbusProtocol(componentId: string) {
    this.service.getCurrentEdge().then(edge => {
      let request = new ComponentJsonApiRequest({ componentId: componentId, payload: new GetModbusProtocolExportXlsxRequest() });
      edge.sendRequest(this.service.websocket, request).then(response => {
        Utils.downloadXlsx(response as Base64PayloadResponse, "Modbus-TCP-" + edge.id);
      }).catch(reason => {
        console.warn(reason);
      })
    });
  }

  public getChannelExport(componentId: string) {
    this.service.getCurrentEdge().then(edge => {
      let request = new ComponentJsonApiRequest({ componentId: '_componentManager', payload: new ChannelExportXlsxRequest({ componentId: componentId }) });
      edge.sendRequest(this.service.websocket, request).then(response => {
        Utils.downloadXlsx(response as Base64PayloadResponse, "ChannelExport-" + edge.id + "-" + componentId);
      }).catch(reason => {
        console.warn(reason);
      })
    });
  };

}