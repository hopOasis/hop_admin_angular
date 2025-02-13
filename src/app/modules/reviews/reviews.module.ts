import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReviewsComponent } from './reviews/reviews.component';

const routes: Routes = [
  { path: '', component: ReviewsComponent }
];

@NgModule({
  declarations: [ReviewsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewsModule { }
