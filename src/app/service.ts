import {Injectable} from "@angular/core";
import {TypedFormHelper, TypedFormHelperService} from "angular-typed-forms-helper";
import {FormControl, FormGroup, Validators} from "@angular/forms";

export interface ArrObjType {
  title: string,
  desc: string,
}

export interface ObjObjType {
  test1: string,
  nuxt1: string,
}

export interface FormType {
  title: string,
  number: number,
  arrStr: string[],
  arrObj: ArrObjType[],
  objObj: ObjObjType
  isEnable: boolean,
}

export type AppFormType = FormGroup<TypedFormHelper<FormType>>

@Injectable()
export class ServiceFormHelper extends TypedFormHelperService<FormType> {
  public override createForm(initValue: FormType): AppFormType {
    return new FormGroup<TypedFormHelper<FormType>>({
      isEnable: new FormControl(initValue.isEnable),
      title: new FormControl(initValue.title, [Validators.required]),
      number: new FormControl(initValue.number, [Validators.required]),
      arrStr: TypedFormHelperService.FormArray(initValue.arrStr),
      arrObj: TypedFormHelperService.FormArray(initValue.arrObj),
      objObj: TypedFormHelperService.FormGroup(initValue.objObj),
    })
  }
}
