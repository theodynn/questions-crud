import { createReducer, on } from '@ngrx/store';
import { Questions } from './questions';
import { questionsFetchAPISuccess, deleteQuestionAPISuccess, saveNewQuestionAPISucess, updateQuestionAPISucess } from './questions.action';


export const initialState: any = JSON.parse(localStorage.getItem('store') || '') || [
  {
    id: 1,
    type:'single',
    question: 'What is my favorite color?',
    options: ['red', 'green', 'blue'],
    answers: [0],
    state: []
  },
  {
    id: 2,
    type: 'multiple',
    question: 'What is the temperature of ice melting?',
    options: ['100 C', '100 F', '212 F'],
    answers: [0, 2],
    state: []
  },
  {
    id: 3,
    type: 'open',
    question: '2 + 2?',
    options: [],
    answers: ['4'],
    state: []
  },
];

export const questionReducer = createReducer(
  initialState,
  on(questionsFetchAPISuccess, (state, { allQuestions }) => {
    return allQuestions;
  }),
  on(saveNewQuestionAPISucess, (state, { newQuestion }) => {
    let newState = [...state];
    newState.unshift(newQuestion);
    localStorage.setItem('store', JSON.stringify(newState));
    return newState;
  }),
  on(updateQuestionAPISucess, (state, { updateQuestion }) => {
    let newState = state.filter((_: any) => _.id != updateQuestion.id);
    newState.unshift(updateQuestion);
    localStorage.setItem('store', JSON.stringify(newState));
    return newState;
  }),
  on(deleteQuestionAPISuccess, (state, { id }) => {
    let newState = state.filter((_: any) => _.id != id);
    localStorage.setItem('store', JSON.stringify(newState));
    return newState;
  })
);
