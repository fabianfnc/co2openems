import { BehaviorSubject } from 'rxjs';
import { ChannelAddress, CurrentData, EdgeConfig } from '../../../../shared/shared';
import { Component } from '@angular/core';
import { Controller_Io_HeatpumpModalComponent } from './modal/modal.component';
import { AbstractFlatWidget } from 'src/app/shared/Generic_Components/flat/abstract-flat-widget';

@Component({
  selector: 'Controller_Io_Heatpump',
  templateUrl: './Io_Heatpump.html'
})
export class Controller_Io_HeatpumpComponent extends AbstractFlatWidget {

  public component: EdgeConfig.Component = null;
  public status: BehaviorSubject<{ name: string }> = new BehaviorSubject(null);
  public isConnectionSuccessful: boolean;
  public mode: string;
  public statusValue: number;

  private static PROPERTY_MODE: string = '_PropertyMode';

  protected getChannelAddresses() {
    return [
      new ChannelAddress(this.component.id, 'Status'),
      new ChannelAddress(this.component.id, 'State'),
      new ChannelAddress(this.component.id, Controller_Io_HeatpumpComponent.PROPERTY_MODE)
    ]
  }

  protected onCurrentData(currentData: CurrentData) {
    this.isConnectionSuccessful = currentData.allComponents[this.componentId + '/State'] != 3 ? true : false;

    // Status
    switch (currentData.allComponents[this.componentId + '/Status']) {
      case -1:
        this.statusValue = this.translate.instant('Edge.Index.Widgets.HeatPump.undefined');
        break;
      case 0:
        this.statusValue = this.translate.instant('Edge.Index.Widgets.HeatPump.lock');
        break;
      case 1:
        this.statusValue = this.translate.instant('Edge.Index.Widgets.HeatPump.normalOperation');
        break;
      case 2:
        this.statusValue = this.translate.instant('Edge.Index.Widgets.HeatPump.switchOnRec');
        break;
      case 3:
        this.statusValue = this.translate.instant('Edge.Index.Widgets.HeatPump.switchOnCom');
        break;
    }

    // Mode
    switch (currentData.thisComponent[Controller_Io_HeatpumpComponent.PROPERTY_MODE]) {
      case 'AUTOMATIC': {
        this.mode = this.translate.instant('General.automatic');
        break;
      }
      case 'MANUAL': {
        this.mode = this.translate.instant('General.manually')
        break;
      }
    }
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: Controller_Io_HeatpumpModalComponent,
      componentProps: {
        edge: this.edge,
        component: this.component,
        status: this.status
      }
    });
    modal.onDidDismiss().then(() => {
      this.service.getConfig().then(config => {
        this.component = config.components[this.componentId];
      })
    })
    return await modal.present();
  }
}
