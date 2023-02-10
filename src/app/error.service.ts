import {Injectable} from "@angular/core";
import {ControlsErrorService} from "angular-typed-forms-helper";

@Injectable()
export class ErrorService extends ControlsErrorService {

  public errorMap = {
    title: {
      required: 'Это поле является обязательным для заполнения',
    },
    number: {
      required: 'Это поле является обязательным для заполнения type Number',
    },
  };
}
