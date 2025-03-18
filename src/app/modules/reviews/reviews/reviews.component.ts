import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { ReviewsService } from '../../../core/services/reviews/reviews.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from '../../../components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    ConfirmDeleteDialogComponent
  ],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  reviews: any[] = [];
  reviewLoading = true;
  displayedColumns: string[] = ['id', 'user', 'content', 'date', 'actions'];

  constructor(private reviewsService: ReviewsService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAllReviews();
  }

  getAllReviews(): void {
    this.reviewsService.getAllReviews().subscribe((data: any) => {
      this.reviews = data;
      this.reviewLoading = false;
      console.log(this.reviews);
    });
  }

  onMoreInfo(reviewId: number): void {
    const review = this.reviews.find(r => r.id === reviewId); 
    if (review) {
      console.log('Модалка с инфой:', JSON.stringify(review, null, 2)); 
    } 
  }
  
  onDeleteReview(reviewId: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: { text: 'Ви дійсно хочете видалити цей відгук?' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteReview(reviewId);
      }
    });
  }

  deleteReview(reviewId: number): void {
    this.reviewsService.deleteReview(reviewId).subscribe(
      (response) => {
        console.log('Відгук було видалено', response);
        this.reviews = this.reviews.filter(review => review.id !== reviewId);  
      },
      (error) => {
        console.error('Не вдалося видалити відгук', error);
      }
    );
  }
}
