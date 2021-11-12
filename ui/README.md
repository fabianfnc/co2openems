# OpenEMS UI

This project was generated with [angular-cli](https://github.com/angular/angular-cli).

## Theme OpenEMS

- OpenEMS Edge - expects a Edge *Controller.Api.Websocket* on default port `8075`

   - Serve to port `4200`
   
      `ng serve`

      `ng serve -o -c openems-edge-dev`

   - Build Development

      `ng build`

      `ng build -c "openems,openems-edge-dev"`

   - Build Production

      `ng build -c "openems,openems-edge-dev,prod"`

- OpenEMS Backend - expects a Backend *Ui.Websocket* on default port `8082`

   - Serve to port `4200`
   
      `ng serve -o -c openems-backend-dev`

   - Build Development

      `ng build -c "openems,openems-backend-dev"`

   - Build Production

      `ng build -c "openems,openems-backend-prod,prod"`

## Further help

#### Creating a Theme

- Create new folder under `/src/themes`
   - Files in `root` will be copied to `/` of the OpenEMS UI
   - `scss/variables.scss` will be used for styling
   - `environments/*.ts` define settings for Backend/Edge and development/production environments
- Generate contents of `root` folder using https://realfavicongenerator.net Place them in `root` subdirectory
- Add entries in `angular.json`

#### i18n - internationalization

Translation is based on [ngx-translate](https://github.com/ngx-translate). The language can be changed at runtime in the "About UI" dialog.

##### In HTML template use:

`<p translate>General.storageSystem</p>`

* add attribute 'translate'
* content of the tag is the path to translation in [translate.ts](app/shared/translate.ts) file

##### In typescript code use:
```
import { TranslateService } from '@ngx-translate/core';
constructor(translate: TranslateService) {}
this.translate.instant('General.storageSystem')
```

#### Subscribe
For "subscribe" please follow this: https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription
```
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
private stopOnDestroy: Subject<void> = new Subject<void>();
ngOnInit() {
    /*subject*/.pipe(takeUntil(this.stopOnDestroy)).subscribe(/*variable*/ => {
        ...
    });
}
ngOnDestroy() {
    this.stopOnDestroy.next();
    this.stopOnDestroy.complete();
}
```