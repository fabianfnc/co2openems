import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AutarchyChartOverviewComponent } from './edge/history/autarchy/autarchychartoverview/autarchychartoverview.component';
import { ChannelthresholdChartOverviewComponent } from './edge/history/channelthreshold/channelthresholdchartoverview/channelthresholdchartoverview.component';
import { ConsumptionChartOverviewComponent } from './edge/history/consumption/consumptionchartoverview/consumptionchartoverview.component';
import { DelayedSellToGridChartOverviewComponent } from './edge/history/delayedselltogrid/symmetricpeakshavingchartoverview/delayedselltogridchartoverview.component';
import { FixDigitalOutputChartOverviewComponent } from './edge/history/fixdigitaloutput/fixdigitaloutputchartoverview/fixdigitaloutputchartoverview.component';
import { GridChartOverviewComponent } from './edge/history/grid/gridchartoverview/gridchartoverview.component';
import { GridOptimizedChargeChartOverviewComponent } from './edge/history/gridoptimizedcharge/gridoptimizedchargechartoverview/gridoptimizedchargechartoverview.component';
import { HeatingelementChartOverviewComponent } from './edge/history/heatingelement/heatingelementchartoverview/heatingelementchartoverview.component';
import { HeatPumpChartOverviewComponent } from './edge/history/heatpump/heatpumpchartoverview/heatpumpchartoverview.component';
import { HistoryComponent as EdgeHistoryComponent } from './edge/history/history.component';
import { AsymmetricPeakshavingChartOverviewComponent } from './edge/history/peakshaving/asymmetric/asymmetricpeakshavingchartoverview/asymmetricpeakshavingchartoverview.component';
import { SymmetricPeakshavingChartOverviewComponent } from './edge/history/peakshaving/symmetric/symmetricpeakshavingchartoverview/symmetricpeakshavingchartoverview.component';
import { TimeslotPeakshavingChartOverviewComponent } from './edge/history/peakshaving/timeslot/timeslotpeakshavingchartoverview/timeslotpeakshavingchartoverview.component';
import { ProductionChartOverviewComponent } from './edge/history/production/productionchartoverview/productionchartoverview.component';
import { SelfconsumptionChartOverviewComponent } from './edge/history/selfconsumption/selfconsumptionchartoverview/selfconsumptionchartoverview.component';
import { SinglethresholdChartOverviewComponent } from './edge/history/singlethreshold/singlethresholdchartoverview/singlethresholdchartoverview.component';
import { StorageChartOverviewComponent } from './edge/history/storage/storagechartoverview/storagechartoverview.component';
import { LiveComponent as EdgeLiveComponent } from './edge/live/live.component';
import { ChannelsComponent as EdgeSettingsChannelsComponent } from './edge/settings/channels/channels.component';
import { IndexComponent as EdgeSettingsComponentInstallIndexComponentComponent } from './edge/settings/component/install/index.component';
import { ComponentInstallComponent as EdgeSettingsComponentInstallComponentComponent } from './edge/settings/component/install/install.component';
import { IndexComponent as EdgeSettingsComponentUpdateIndexComponentComponent } from './edge/settings/component/update/index.component';
import { ComponentUpdateComponent as EdgeSettingsComponentUpdateComponentComponent } from './edge/settings/component/update/update.component';
import { NetworkComponent as EdgeSettingsNetworkComponent } from './edge/settings/network/network.component';
import { AliasUpdateComponent } from './edge/settings/profile/aliasupdate.component';
import { ProfileComponent as EdgeSettingsProfileComponent } from './edge/settings/profile/profile.component';
import { SettingsComponent as EdgeSettingsComponent } from './edge/settings/settings.component';
import { SystemExecuteComponent as EdgeSettingsSystemExecuteComponent } from './edge/settings/systemexecute/systemexecute.component';
import { SystemLogComponent as EdgeSettingsSystemLogComponent } from './edge/settings/systemlog/systemlog.component';
import { IndexComponent } from './index/index.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent },

  { path: 'user', component: UserComponent },

  // Edge Pages
  { path: 'device/:edgeId', redirectTo: 'device/:edgeId/live', pathMatch: 'full' },
  { path: 'device/:edgeId/live', component: EdgeLiveComponent },
  { path: 'device/:edgeId/history', component: EdgeHistoryComponent },

  // History Chart Pages
  { path: 'device/:edgeId/history/:componentId/asymmetricpeakshavingchart', component: AsymmetricPeakshavingChartOverviewComponent },
  { path: 'device/:edgeId/history/:componentId/channelthresholdchart', component: ChannelthresholdChartOverviewComponent },
  { path: 'device/:edgeId/history/:componentId/delayedselltogridchart', component: DelayedSellToGridChartOverviewComponent },
  { path: 'device/:edgeId/history/:componentId/fixdigitaloutputchart', component: FixDigitalOutputChartOverviewComponent },
  { path: 'device/:edgeId/history/:componentId/gridOptimizedChargeChart', component: GridOptimizedChargeChartOverviewComponent },
  { path: 'device/:edgeId/history/:componentId/heatingelementchart', component: HeatingelementChartOverviewComponent },
  { path: 'device/:edgeId/history/:componentId/heatpumpchart', component: HeatPumpChartOverviewComponent },
  { path: 'device/:edgeId/history/:componentId/singlethresholdchart', component: SinglethresholdChartOverviewComponent },
  { path: 'device/:edgeId/history/:componentId/symmetricpeakshavingchart', component: SymmetricPeakshavingChartOverviewComponent },
  { path: 'device/:edgeId/history/:componentId/timeslotpeakshavingchart', component: TimeslotPeakshavingChartOverviewComponent },
  { path: 'device/:edgeId/history/autarchychart', component: AutarchyChartOverviewComponent },
  { path: 'device/:edgeId/history/consumptionchart', component: ConsumptionChartOverviewComponent },
  { path: 'device/:edgeId/history/gridchart', component: GridChartOverviewComponent },
  { path: 'device/:edgeId/history/productionchart', component: ProductionChartOverviewComponent },
  { path: 'device/:edgeId/history/selfconsumptionchart', component: SelfconsumptionChartOverviewComponent },
  { path: 'device/:edgeId/history/storagechart', component: StorageChartOverviewComponent },

  { path: 'device/:edgeId/settings', component: EdgeSettingsComponent },
  { path: 'device/:edgeId/settings/channels', component: EdgeSettingsChannelsComponent },
  { path: 'device/:edgeId/settings/component.install', component: EdgeSettingsComponentInstallIndexComponentComponent },
  { path: 'device/:edgeId/settings/component.install/:factoryId', component: EdgeSettingsComponentInstallComponentComponent },
  { path: 'device/:edgeId/settings/component.update', component: EdgeSettingsComponentUpdateIndexComponentComponent },
  { path: 'device/:edgeId/settings/component.update/:componentId', component: EdgeSettingsComponentUpdateComponentComponent },
  { path: 'device/:edgeId/settings/network', component: EdgeSettingsNetworkComponent },
  { path: 'device/:edgeId/settings/profile', component: EdgeSettingsProfileComponent },
  { path: 'device/:edgeId/settings/profile/:componentId', component: AliasUpdateComponent },
  { path: 'device/:edgeId/settings/systemexecute', component: EdgeSettingsSystemExecuteComponent },
  { path: 'device/:edgeId/settings/systemlog', component: EdgeSettingsSystemLogComponent },
];

export const appRoutingProviders: any[] = [

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
