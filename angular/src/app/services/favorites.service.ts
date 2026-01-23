import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly STORAGE_KEY_PREFIX = 'blog_favorites_';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private getUserId(): string {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.userId || 'guest';
        } catch {
          return 'guest';
        }
      }
    }
    return 'guest';
  }

  private getStorageKey(): string {
    return this.STORAGE_KEY_PREFIX + this.getUserId();
  }

  getFavorites(): string[] {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(this.getStorageKey());
      return data ? JSON.parse(data) : [];
    }
    return [];
  }

  toggleFavorite(id: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    let favorites = this.getFavorites();
    if (favorites.includes(id)) {
      favorites = favorites.filter(favId => favId !== id);
    } else {
      favorites.push(id);
    }
    localStorage.setItem(this.getStorageKey(), JSON.stringify(favorites));
  }

  isFavorite(id: string): boolean {
    const favorites = this.getFavorites();
    return favorites.includes(id);
  }
}