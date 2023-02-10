import { Component, OnInit } from '@angular/core';
import { AppFormType, FormType, ServiceFormHelper } from "./service";
import { TypedFormHelperComponent } from "angular-typed-forms-helper";
import { isEnableStream } from "./streams/is-enable.stream";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent extends TypedFormHelperComponent implements OnInit {
  title = 'typed-forms-helper';

  firstValueForm: FormType = {
    isEnable: true,
    title: null,
    number: 1,
    arrStr: ['1a', '2a'],
    arrObj: [
      {
        title: 'wsewsfds',
        desc: 'sfgfsgfd',
      },
      {
        title: '453t4rtref',
        desc: '34t54tg',
      },
    ],
    objObj: {
      test1: 'test1 test test',
      nuxt1: 'tetwwe'
    }
  };

  form: AppFormType;

  constructor(private formService: ServiceFormHelper) {
    super();
  }

  ngOnInit() {
    this.form = this.formService.init(this.firstValueForm);
    this.initStreams([
      isEnableStream(this.form),
    ]);
  }

  showInfo(): void {
    console.log(this.form.getRawValue());
  }
}
