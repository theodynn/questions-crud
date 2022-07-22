import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { setAPIStatus } from 'src/app/shared/store/app.action';
import { selectAppState } from 'src/app/shared/store/app.selector';
import { Appstate } from 'src/app/shared/store/appstate';
import { invokeQuestionsAPI, invokeDeleteQuestionAPI } from '../store/questions.action';
import { selectQuestions } from '../store/questions.selector';

declare var window: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private store: Store, private appStore: Store<Appstate>) {}

  questions$ = this.store.pipe(select(selectQuestions));

  deleteModal: any;
  idToDelete: number = 0;

  ngOnInit(): void {
    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('deleteModal')
    );

    this.store.dispatch(invokeQuestionsAPI());
  }

  toDate(id: number){
    let d = new Date(id);
    return `${d.toDateString()}`
  }

  openDeleteModal(id: number) {
    this.idToDelete = id;
    this.deleteModal.show();
  }

  delete() {
    this.store.dispatch(
      invokeDeleteQuestionAPI({
        id: this.idToDelete,
      })
    );
    let apiStatus$ = this.appStore.pipe(select(selectAppState));
    apiStatus$.subscribe((apState) => {
      if (apState.apiStatus == 'success') {
        this.deleteModal.hide();
        this.appStore.dispatch(
          setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
        );
      }
    });
  }
}
