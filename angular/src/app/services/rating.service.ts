import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private readonly STORAGE_KEY = 'blog_ratings';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Pobiera wszystkie oceny dla danego ID posta
  getPostRatings(postId: string): number[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    
    const allRatings = this.getAllRatingsData();
    return allRatings[postId] || [];
  }

  // Dodaje nową ocenę
  addRating(postId: string, rating: number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const allRatings = this.getAllRatingsData();
    
    if (!allRatings[postId]) {
      allRatings[postId] = [];
    }
    
    allRatings[postId].push(rating);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allRatings));
  }

  // Oblicza średnią
  getAverageRating(postId: string): number {
    const ratings = this.getPostRatings(postId);
    if (ratings.length === 0) return 0;
    
    const sum = ratings.reduce((a, b) => a + b, 0);
    return sum / ratings.length;
  }

  // Pomocnicza metoda do pobrania całego obiektu z LocalStorage
  private getAllRatingsData(): { [key: string]: number[] } {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }
}