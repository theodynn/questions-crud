import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { EMPTY, map, mergeMap, switchMap, withLatestFrom } from 'rxjs';
import { setAPIStatus } from 'src/app/shared/store/app.action';
import { Appstate } from 'src/app/shared/store/appstate';
import { QuestionsService } from '../questions.service';
import {
  questionsFetchAPISuccess,
  deleteQuestionAPISuccess,
  invokeQuestionsAPI,
  invokeDeleteQuestionAPI,
  invokeSaveNewQuestionAPI,
  invokeUpdateQuestionAPI,
  saveNewQuestionAPISucess,
  updateQuestionAPISucess,
} from './questions.action';  
import { selectQuestions } from './questions.selector';

@Injectable()
export class QuestionsEffect {
  constructor(
    private actions$: Actions,
    private questionsService: QuestionsService,
    private store: Store,
    private appStore: Store<Appstate>
  ) {}

  loadAllQuestions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(invokeQuestionsAPI),
      withLatestFrom(this.store.pipe(select(selectQuestions))),
      mergeMap(([, questionformStore]) => {
        if (questionformStore.length > 0) {
          return EMPTY;
        }
        return this.questionsService
          .get()
          .pipe(map((data) => questionsFetchAPISuccess({ allQuestions: data })));
      })
    )
  );

  saveNewQuestion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(invokeSaveNewQuestionAPI),
      switchMap((action) => {
        this.appStore.dispatch(
          setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
        );
        return this.questionsService.create(action.newQuestion).pipe(
          map((data) => {
            this.appStore.dispatch(
              setAPIStatus({
                apiStatus: { apiResponseMessage: '', apiStatus: 'success' },
              })
            );
            return saveNewQuestionAPISucess({ newQuestion: data });
          })
        );
      })
    );
  });

  updateQuestionAPI$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(invokeUpdateQuestionAPI),
      switchMap((action) => {
        this.appStore.dispatch(
          setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
        );
        return this.questionsService.update(action.updateQuestion).pipe(
          map((data) => {
            this.appStore.dispatch(
              setAPIStatus({
                apiStatus: { apiResponseMessage: '', apiStatus: 'success' },
              })
            );
            return updateQuestionAPISucess({ updateQuestion: data });
          })
        );
      })
    );
  });

  deleteQuestionsAPI$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(invokeDeleteQuestionAPI),
      switchMap((actions) => {
        this.appStore.dispatch(
          setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
        );
        return this.questionsService.delete(actions.id).pipe(
          map(() => {
            this.appStore.dispatch(
              setAPIStatus({
                apiStatus: { apiResponseMessage: '', apiStatus: 'success' },
              })
            );
            return deleteQuestionAPISuccess({ id: actions.id });
          })
        );
      })
    );
  });
}
