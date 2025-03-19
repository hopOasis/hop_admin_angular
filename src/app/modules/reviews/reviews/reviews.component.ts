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
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDeleteDialogComponent } from '../../../components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatInputModule, 
    MatFormFieldModule,
    ConfirmDeleteDialogComponent
  ],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  reviews: any[] = [];
  filteredReviews: any[] = [];
  displayedColumns: string[] = ['id', 'user', 'content', 'date', 'actions'];
  searchText: string = '';
  filterDate: string = '';

  constructor(private reviewsService: ReviewsService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAllReviews();
  }

  getAllReviews(): void {
    this.reviewsService.getAllReviews().subscribe((reviews: any) => {
      this.reviews = reviews;
      this.reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      this.filteredReviews = [...this.reviews];
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
  applyFilters(): void {
    const query = this.searchText.trim().toLowerCase();
    const date = this.filterDate;
  
    this.filteredReviews = this.reviews.filter((review) => {
      const matchesQuery = review.content?.toLowerCase().includes(query) || review.id.toString().includes(query);
      return matchesQuery 
    });
  }
  
}
