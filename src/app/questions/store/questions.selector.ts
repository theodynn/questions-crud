import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Questions } from './questions';

export const selectQuestions = createFeatureSelector<Questions[]>('myquestions');

export const selectQuestionById = (questionId: number) =>
  createSelector(selectQuestions, (questions: Questions[]) => {
    var questionbyId = questions.filter((_) => _.id == questionId);
    if (questionbyId.length == 0) {
      return null;
    }
    return questionbyId[0];
  });
