import { createAction, props } from '@ngrx/store';
import { Questions } from './questions';

export const invokeQuestionsAPI = createAction(
  '[Questions API] Invoke Questions Fetch API'
);

export const questionsFetchAPISuccess = createAction(
  '[Questions API] Fetch API Success',
  props<{ allQuestions: Questions[] }>()
);

export const invokeSaveNewQuestionAPI = createAction(
  '[Questions API] Inovke save new question api',
  props<{ newQuestion: Questions }>()
);

export const saveNewQuestionAPISucess = createAction(
  '[Questions API] save new question api success',
  props<{ newQuestion: Questions }>()
);

export const invokeUpdateQuestionAPI = createAction(
  '[Questions API] Inovke update question api',
  props<{ updateQuestion: Questions }>()
);

export const updateQuestionAPISucess = createAction(
  '[Questions API] update  question api success',
  props<{ updateQuestion: Questions }>()
);

export const invokeDeleteQuestionAPI = createAction(
  '[Questions API] Inovke delete question api',
  props<{id:number}>()
);

export const deleteQuestionAPISuccess = createAction(
  '[Questions API] deleted question api success',
  props<{id:number}>()
);