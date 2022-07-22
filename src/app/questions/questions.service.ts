import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Questions } from './store/questions';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  constructor(private http: HttpClient) {}
  get() {
    let data: any[] = []
    return of(data);
  }

  create(payload: Questions) {
    return of(payload);
  }

  update(payload: Questions) {
    return of(payload);
  }

  delete(id: number) {
    return of({})
  }
}
