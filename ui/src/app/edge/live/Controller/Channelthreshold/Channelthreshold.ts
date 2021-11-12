import { ChannelAddress, CurrentData } from '../../../../shared/shared';
import { Component } from '@angular/core';
import { AbstractFlatWidget } from 'src/app/shared/Generic_Components/flat/abstract-flat-widget';
import { Icon } from 'src/app/shared/type/widget';

@Component({
  selector: 'Controller_Channelthreshold',
  templateUrl: './Channelthreshold.html'
})
export class Controller_ChannelthresholdComponent extends AbstractFlatWidget {

  public outputChannel: ChannelAddress;
  public icon: Icon = {
    name: '',
    size: 'large',
    color: 'dark'
  };
  public state: string = '?';

  protected getChannelAddresses() {
    this.outputChannel = ChannelAddress.fromString(this.component.properties['outputChannelAddress'])
    return [this.outputChannel]
  }
  protected onCurrentData(currentData: CurrentData) {
    let channel = currentData.allComponents[this.outputChannel.toString()];
    if (channel != null) {
      if (channel == 1) {
        this.icon.name = "radio-button-on-outline"
        this.state = this.translate.instant('General.on');
      } else if (channel == 0) {
        this.icon.name = 'radio-button-off-outline'
        this.state = this.translate.instant('General.off');
      }
    } else {
      this.icon.name = 'help-outline'
    }
  }
}
