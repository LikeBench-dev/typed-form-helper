# Ngx Typed Form Helper

> ### Основные преимущества: ###
> - Уменьшение количества кода. Вынос больших кусков (в основном стримов) за пределы компонента
> - Интуитивно понятная работа с формой, стримами и контролами
> - Легкий порог вхождения новых разработчиков
> - Приведение к единому стилю для удобства дебага и рефакторинга
> - Каждая часть хелпера является независимой
>
> Это не означает их обязательное использование везде.
>
> Осовные места применения:
>  - компоненты формы
>  - компоненты с большой бизнес логикой

## Основные части хелпера

- typed-form-helper.component
- typed-form-helper.service
 
В дальнейшем соответственно Component Helper и Service Helper.

## `Component Helper`

- Работа со стримами. Подписка, отписка, обнаружение изменений.

```
@Component({
  selector: 'app-...-form',
  ...
})
export class YOUR_NAME_COMPONENT extends TypedFormHelperComponent implements OnInit {
  ngOnInit(): void {
    this.initStreams()
  }
  
  protected setListeners(): Array<Observable<any>> {
    return [contractInfoStream(this.form), updateDocumentNumberStream(this.form, this.docNumberService)];
 }
}
```
`initStreams()` - запуск стримов

`setListeners()` - набор стримов. Которые хранятся в отдельной папке, чтобы не нагромождать код. В любой стрим, например `contractInfoStream(this.form, ...)`, обязательно передавать саму форму.

### `Пример стрима`
```
export const isEnableStream = (form: TypedFormHelperService<YOUR_MODEL_DATA_CLASS>): Observable<any> =>
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
```


## `Service Helper`
- Инициализация типизированной формы с установкой значений
- Добавление валидации в форму
- Удобная работа с объектами и массивами данных
- Использование специального интерфейса для адаптации бековых данных под типизированную форму

```
form.module.ts

@NgModule({
  imports: [],
  providers: [
   {
     provide: TypedFormHelperService,
     useClass: YOUR_FORM_Service,
   },
  ],
})
export class FormModule {}
```

```
YOUR_NAME_COMPONENT.component.ts

@Component({
  selector: 'app-...-form',
  ...
})
export class YOUR_NAME_COMPONENT extends TypedFormHelperComponent implements OnInit {
  constructor(
    private formHelper: TypedFormHelperService<YOUR_MODEL_DATA_CLASS, FormConfig>,
  ) {}
  
  ngOnInit(): void {
    this.form = this.formHelper.init(formData.currentValue, {
      isHolding: this.isHolding,
    });
  }
}
```

`YOUR_FORM_Service` - имя вашего сервиса, который наследуется от ExtensionFormHelperService

`YOUR_MODEL_DATA_CLASS` - имя вашего класса, который является интерфейсом для данных с бека

`FormConfig` - интерфейс дополнительной конфигурации для сервиса.

`formHelper.init()` - инициализация формы.

Благодаря `FormConfig`, в дочерних компонентах формы, мы сможем дотягиваться до нужных данных (через наш сервис). Например, при инициализации стрима и выполнения некоторых условий.

```
YOUR_FORM_Service.ts


@Injectable()
export class YOUR_FORM_Service extends TypedFormHelperService<YOUR_MODEL_DATA_CLASS, FormConfig> {
  public createForm(initValue: YOUR_MODEL_DATA_CLASS): FormGroup<TypedFormHelper<YOUR_MODEL_DATA_CLASS>> {
    return new FormGroup<ControlsForm<YOUR_MODEL_DATA_CLASS>>({
      id: new FormControl(initValue?.id),
      date: new FormControl(initValue.date),
      number: new FormControl(initValue.number),
      contractInfo: TypedFormHelperService.FormGroup<ContractInfo>(
        initValue.contractInfo || {
          id: null,
          uniqueNumber: null,
          counterparties: null,
        },
        {
          uniqueNumber: [Validators.required],
        },
      ),
      lines: TypedFormHelperService.FormArray<ANY_INTERFACE>(initValue?.lines),
      ...
    })
  
  public createCollapseForm(...){}
}
```

`createForm(...)` - функция для создания формы в основном компонент формы

`ControlsForm<>` - специальный интерфейс для адаптации бековых данных под типизированную форму

`TypedFormHelperService.FormArray<ANY_INTERFACE>(...)` - статичный метод для создания типизированной FormGroup (не обязательное использование)

`TypedFormHelperService.FormGroup<ANY_INTERFACE>(...)` - статичный метод для создания типизированного FormArray **(рекомендуется для использования)**

`createCollapseForm(...)` - функция для создания формы, на основе какого-либо объекта из повторяющегося блока на странице, для collapse-row

### Подробнее про ***createCollapseForm()***
> Используется для создания формы в компонент CollapseRow
>
> * @param fields
> * @param typeFormControl используется только в случае множественного использования
> компонента CollapseRow в одном месте
> * @param index индекс строки
> * @param isCopy флаг при копировании строки
> 
> Если используется несколько компонентов CollapseRow в одном месте,
> то необходимо сделать enum с названиями используемых внешних контроллеров
> и использовать createCollapseForm с if или switch кейсами вызывая свои функции в этом сервисе,
> сравнивая enum с typeFormControl


## Дополнительные части хелпера

- submit-helper
- control-set
- control-error

### Submit Helper
Это директива, которая проверяет форму на наличие ошибок и триггерит их. Удобно использовать при submit() формы

### Control Set
Это директива, которая обнуляет данные в контроле, когда он удаляется из темплейта.

```
Пример:
          <app-form-section *ngIf="doIExist">
            <app-form-row>
          
              <app-input>
                <input
                  tfh-control-set
                  formControlName="changedItem"
                />
              </app-input>
              
            </app-form-row>
```
В данном примере мы видим, что блок будет скрыт при определенных условиях. Чтобы информация в контроле "changedItem" обнулилась, необходимо создать стрим с обнулением или навесить директиву `control-set`

### Control Error
Это полноценный модуль, который включает в себя сервис, директивы и компонент для работы с контролами формы. 

- control-error.directive
- control-error-container.directive
- controls-error.service
- control-error.component

```
form.module.ts

@NgModule({
  imports: [
    ControlErrorModule,
  ],
  providers: [
    {
      provide: ControlsErrorService,
      useClass: YOUR_NAME_ErrorsService,
    },
  ],
})
export class FormModule {}
```

```
YOUR_NAME_ErrorsService.service.ts

@Injectable()
export class YOUR_NAME_ErrorsService extends ControlsErrorService {
  private translocoService = inject(TranslocoService);

  private required = this.translocoService.translate('currencyControls.ca.form.errors.required');

  public errorMap = {
    clientId: {
      required: this.required,
    },
   };
```

`ControlsErrorService` - сервис, от которого необходимо наследоваться, добавляя туда карту с переводами ошибок

`control-error.directive` - директива, которая рендерит компонент `control-error.component` и добавляет туда текст ошибки из `ControlsErrorService`

`control-error-container.directive` - контейнер, который используется для обертки контрола, если нельзя дотянуться до formControlName. Не забываем про `control-error.directive`

#### Пример с control-error-container.directive и control-error.directive:
```
          <app-form-section>
            <app-form-row>
            
              <app-input tfh-control-error-container>
                <input
                  tfh-control-error
                  formControlName="changedItem"
                />
              </app-input>
              
            </app-form-row>
```

#### Пример с control-error.directive:
```
            <ng-container [formGroup]="internalContractForm">
              <app-select
                formControlName="uniqueNumber"
                tfh-control-error
              >
                ...
              </app-select>
            </ng-container>
```
