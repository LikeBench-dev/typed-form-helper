import { AppFormType } from "../service";
import {Observable, startWith, tap } from "rxjs";

export const isEnableStream = (form: AppFormType): Observable<any> =>
  form.get('isEnable').valueChanges.pipe(
    startWith(form.controls.isEnable.value),
    tap({
      next: value => {
        if (value) {
          form.controls.number.enable()
          form.controls.objObj.enable()
        } else {
          form.controls.number.disable();
          form.controls.objObj.disable();
        }
      },
    }),
  );
