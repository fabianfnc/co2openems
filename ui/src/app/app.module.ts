import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ChartOptionsPopoverComponent } from './shared/chartoptions/popover/popover.component';
import { CookieService } from 'ngx-cookie-service';
import { EdgeModule } from './edge/edge.module';
import { IndexModule } from './index/index.module';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { Language } from './shared/translate/language';
import { LOCALE_ID, NgModule } from '@angular/core';
import { PickDatePopoverComponent } from './shared/pickdate/popover/popover.component';
import { registerLocaleData } from '@angular/common';
import { RegistrationModule } from './registration/registration.module';
import { RouteReuseStrategy } from '@angular/router';
import { SettingsModule as EdgeSettingsModule } from './edge/settings/settings.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { StatusSingleComponent } from './shared/status/single/status.component';
import { SystemLogComponent } from './edge/settings/systemlog/systemlog.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UserModule } from './user/user.module';
import localDE from '@angular/common/locales/de';

@NgModule({
  declarations: [
    AppComponent,
    ChartOptionsPopoverComponent,
    PickDatePopoverComponent,
    StatusSingleComponent,
    SystemLogComponent,
  ],
  entryComponents: [
    ChartOptionsPopoverComponent,
    PickDatePopoverComponent,
  ],
  imports: [
    AngularMyDatePickerModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    EdgeModule,
    EdgeSettingsModule,
    IndexModule,
    HttpClientModule,
    IonicModule.forRoot(),
    RegistrationModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useClass: Language }
    }),
    UserModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    CookieService,
    // { provide: ErrorHandler, useExisting: Service },
    { provide: LOCALE_ID, useValue: 'de' }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    registerLocaleData(localDE);
  }
}
