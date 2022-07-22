import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { switchMap } from 'rxjs';
import { setAPIStatus } from 'src/app/shared/store/app.action';
import { selectAppState } from 'src/app/shared/store/app.selector';
import { Appstate } from 'src/app/shared/store/appstate';
import { Questions, TYPES } from '../store/questions';
import { invokeUpdateQuestionAPI } from '../store/questions.action';
import { invokeSaveNewQuestionAPI } from '../store/questions.action';
import { selectQuestionById } from '../store/questions.selector';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent implements OnInit {
  constructor(
    private store: Store,
    private appStore: Store<Appstate>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {}


  types = TYPES;
  
  questionForm = this.fb.group({
      type: new FormControl(this.types[0], {nonNullable: true}),
      question: new FormControl('', {nonNullable: true}),
      options: this.fb.array([]),
      checkboxes: this.fb.array([]),
      selectedAnswer:  new FormControl('', {nonNullable: true}),
    }
  )

  answers: Array<any> = [];

  ngOnInit(): void {
    let fetchData$ = this.route.paramMap.pipe(
      switchMap((params) => {
        var id = Number(params.get('id'));
        return this.store.pipe(select(selectQuestionById(id)));
      })
    );
    fetchData$.subscribe((data) => {
      if (data) {
        this.questionForm.patchValue({
          ...data
        })
        data.options.forEach((el: string, id: number) => {
          this.addOption(el, id, data.answers);
        });
        this.answers = [...data.answers];
        if(data.type === 'single'){
          this.questionForm.patchValue({
            selectedAnswer: data.answers[0]
          })
        }
      }
    });
  }

  get options() {
    return this.questionForm.controls['options'] as FormArray;
  }

  get checkboxes() : any {
    return this.questionForm.controls['checkboxes'] as FormArray;
  }

  get type() {
    return this.questionForm.controls['type'].value;
  }

  get isEdit() {
    return this.route.snapshot.params.hasOwnProperty('id');
  }

  addOption(el?: string, id?: number, answers?: Array<any>) {
    const optionForm = this.fb.group({
      option: new FormControl(el || '', [Validators.required, Validators.minLength(5)]),
      checkbox: new FormControl(answers?.includes(id) || false),
    });
    this.options.push(optionForm);;
  }

  changeType(type: any){
    this.answers = [];
    if(this.type === 'open'){
      this.options.clear(); 
      this.addOption();
    }
  }

  changeAnswer(answer: any, i?: number){
    if(this.type === 'single'){
      this.answers = [parseInt(answer.target.value)];
    } else if(this.type === 'multiple'){
      if(answer.target.checked){
        this.answers.push(i); 
      } else {
        let ind = this.answers.indexOf(i);
        this.answers.splice(ind, 1);
      }
      if(i) this.checkboxes[i] = answer.target.checked;
    } else if(this.type === 'open') {
      this.answers = [];
      this.answers[0] = answer.target.value;
    }
  }

  customValidate(){
    return (this.options.value.length >= 2 && this.type !== 'open' || this.type === 'open') && this.answers.length;
  }

  submit() {
    let payload: Questions = {
      id: (new Date()).getTime(),
      question: this.questionForm.value.question,
      options: this.questionForm.value.options,
      type: this.questionForm.value.type,
      answers: this.answers,
      state: []
    };
    payload.options = this.questionForm.value.options?.map((el: any) => el.option)
    this.isEdit ? this.update(payload) : this.save(payload);
  }
  
  save(payload: Questions) {
    this.store.dispatch(invokeSaveNewQuestionAPI({ newQuestion: payload }));
    this.router.navigate(['/']);
    let apiStatus$ = this.appStore.pipe(select(selectAppState));
    apiStatus$.subscribe((apState) => {
      if (apState.apiStatus == 'success') {
        this.appStore.dispatch(
          setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
        );
      }
    });
  }

  update(payload: Questions) {
    this.store.dispatch(
      invokeUpdateQuestionAPI({ updateQuestion: payload })
    );
    this.router.navigate(['/']);
    let apiStatus$ = this.appStore.pipe(select(selectAppState));
    apiStatus$.subscribe((apState) => {
      if (apState.apiStatus == 'success') {
        this.appStore.dispatch(
          setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
        );
      }
    });
  }
}
