import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {TypedFormHelperService} from "../../projects/angular-typed-forms-helper/src/lib/typed-form-helper.service";
import {ServiceFormHelper} from "./service";
import {ReactiveFormsModule} from "@angular/forms";
import {
  ControlErrorModule,
  ControlsErrorService,
  ControlSetModule,
  SubmitHelperModule
} from "angular-typed-forms-helper";
import {ErrorService} from "./error.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    ControlSetModule,
    ControlErrorModule,
    SubmitHelperModule
  ],
  providers: [
    // {
    //   provide: TypedFormHelperService,
    //   useClass: ServiceFormHelper,
    // },
    ServiceFormHelper,
    // ErrorService,
    {
      provide: ControlsErrorService,
      useClass: ErrorService,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
