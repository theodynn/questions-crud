import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionsRoutingModule } from './questions-routing.module';
import { HomeComponent } from './home/home.component';
import { StoreModule } from '@ngrx/store';
import { questionReducer } from './store/questions.reducer';
import { EffectsModule } from '@ngrx/effects';
import { QuestionsEffect } from './store/questions.effect';
import { AddComponent } from './add/add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { SearchFilterPipe } from '../shared/pipes/search-filter.pipe';

@NgModule({
  declarations: [HomeComponent, AddComponent, ListComponent, SearchFilterPipe],
  imports: [
    CommonModule,
    QuestionsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('myquestions', questionReducer),
    EffectsModule.forFeature([QuestionsEffect]),
  ],
})
export class QuestionsModule {}
