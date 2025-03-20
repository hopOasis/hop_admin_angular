import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReviewsService } from '../../../core/services/reviews/reviews.service';
import { ConfirmDeleteDialogComponent } from '../../../components/confirm-delete-dialog/confirm-delete-dialog.component';
import { Observable, Subject } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Review } from '../../../core/models/reviews.model';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../../core/services/notification/notification.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    MatTableModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    ConfirmDeleteDialogComponent,
  ],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  displayedColumns: string[] = ['id', 'user', 'content', 'date', 'actions'];
  searchText = '';

  constructor(
    private reviewsService: ReviewsService,
    private dialog: MatDialog,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.getAllReviews();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAllReviews(): void {
    this.reviewsService
      .getAllReviews()
      .pipe(takeUntil(this.destroy$))
      .subscribe((reviews: Review[]) => {
        this.reviews = reviews.sort(
          (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        this.filteredReviews = [...this.reviews];
      });
  }

  private openConfirmationDialog(message: string): Observable<boolean> {
    return this.dialog
      .open(ConfirmDeleteDialogComponent, { data: { text: message } })
      .afterClosed()
      .pipe(takeUntil(this.destroy$));
  }

  onDeleteReview(reviewId: number): void {
    this.openConfirmationDialog(
      'Ви дійсно хочете видалити цей відгук?'
    ).subscribe((confirmed) => {
      if (confirmed) this.deleteReview(reviewId);
    });
  }

  deleteReview(reviewId: number): void {
    this.reviewsService
      .deleteReview(reviewId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.reviews = this.reviews.filter(
            (review) => review.id !== reviewId
          );
          this.notification.show('Відгук було видалено');
        },
        () => this.notification.show('Не вдалося видалити відгук')
      );
  }

  private filterByQuery(review: Review, query: string): boolean {
    return (
      review.content?.toLowerCase().includes(query) ||
      review.id.toString().includes(query)
    );
  }

  applyFilters(): void {
    const query = this.searchText.trim().toLowerCase();
    this.filteredReviews = this.reviews.filter((review) =>
      this.filterByQuery(review, query)
    );
  }
}
