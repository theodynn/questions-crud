import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs';
import { setAPIStatus } from 'src/app/shared/store/app.action';
import { selectAppState } from 'src/app/shared/store/app.selector';
import { Appstate } from 'src/app/shared/store/appstate';
import { Questions } from '../store/questions';
import { invokeQuestionsAPI, invokeDeleteQuestionAPI, invokeUpdateQuestionAPI } from '../store/questions.action';
import { selectQuestions } from '../store/questions.selector';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  constructor(private store: Store, private appStore: Store<Appstate>, private router: Router) {}

  questions$ =  this.store.pipe(select(selectQuestions));

  deleteModal: any;
  idToDelete: number = 0;
  answers: any = {};
  checkboxes: any = {};

  ngOnInit(): void {
    this.store.dispatch(invokeQuestionsAPI());
    this.updateAnswersArray();
  }

  updateAnswersArray(){
    this.questions$.pipe().subscribe((el: any)=>{
      this.answers = {};
      this.checkboxes = {};
      el.forEach((e: any) => {
        this.answers[e.id.toString()] = [...e.state];
        if(e.type === 'multiple'){
          this.checkboxes[e.id.toString()] = [];
          e.options.forEach((_: any, ind: any) => {
            this.checkboxes[e.id.toString()].push(e.state.includes(ind));
          })
        }
      })
    })
  }

  changeAnswer(i: any, answer: any){
    let ind = this.answers[i].indexOf(answer);
    if(ind === -1){
      this.answers[i.toString()].push(answer);
    } else {
      this.answers[i.toString()].splice(ind, 1);
    }
  }

  storeAnswer(index: any, isDelete: boolean){
    this.questions$.pipe(take(1)).subscribe((el: any) => {
      let id = el.findIndex((e: any) => e.id === index)
      let payload: Questions = {
        ...el[id]
      }
      payload.state = isDelete ? [] : this.answers[index.toString()];
      this.update(payload);
    })
  }


  update(payload: Questions) {
    this.store.dispatch(
      invokeUpdateQuestionAPI({ updateQuestion: payload })
    );

    let apiStatus$ = this.appStore.pipe(select(selectAppState));
    apiStatus$.subscribe((apState) => {
      if (apState.apiStatus == 'success') {
        this.appStore.dispatch(
          setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
        );
      }
    });
  }

  isCorrect(question: Questions){
    const equalsIgnoreOrder = (a: any, b: any) => {
      if (a.length !== b.length) return false;
      const uniqueValues = new Set([...a, ...b]);
      for (const v of uniqueValues) {
        const aCount = a.filter((e: any) => e === v).length;
        const bCount = b.filter((e: any) => e === v).length;
        if (aCount !== bCount) return false;
      }
      return true;
    }
    return equalsIgnoreOrder(question.answers, question.state) ? 'Correct' : 'Incorrect'
  }

  toDate(id: number){
    let d = new Date(id);
    return `${d.toDateString()}`
  }


}
