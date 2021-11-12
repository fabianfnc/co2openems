import { Component } from '@angular/core';
import { ChannelAddress, CurrentData } from 'src/app/shared/shared';
import { AbstractFlatWidget } from 'src/app/shared/Generic_Components/flat/abstract-flat-widget';
import { Controller_Io_FixDigitalOutputModalComponent } from './modal/modal.component';


@Component({
  selector: 'Controller_Io_FixDigitalOutput',
  templateUrl: './Io_FixDigitalOutput.html'
})
export class Controller_Io_FixDigitalOutput extends AbstractFlatWidget {

  public state: string = '-';
  public outputChannel: string;

  protected getChannelAddresses(): ChannelAddress[] {
    this.outputChannel = this.component.properties['outputChannelAddress'];
    return [ChannelAddress.fromString(this.outputChannel)];
  }

  protected onCurrentData(currentData: CurrentData) {
    let channel = currentData.allComponents[this.outputChannel];
    if (channel != null) {
      if (channel == 1) {
        this.state = this.translate.instant('General.on');
      } else if (channel == 0) {
        this.state = this.translate.instant('General.off');
      }
    }
  }

  async presentModal() {
    if (!this.isInitialized) {
      return;
    }
    const modal = await this.modalController.create({
      component: Controller_Io_FixDigitalOutputModalComponent,
      componentProps: {
        component: this.component,
        edge: this.edge
      }
    });
    return await modal.present();
  }
}
