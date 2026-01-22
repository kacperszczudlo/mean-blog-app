import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'blog',
    loadComponent: () => import('./components/blog/blog.component').then(m => m.BlogComponent),
    canActivate: [authGuard]
  },
  {
    path: 'blog/detail/:id', // Ścieżka do szczegółów posta 
    loadComponent: () => import('./components/blog-item-details/blog-item-details.component').then(m => m.BlogItemDetailsComponent)
  },
  {
    path: 'blog/add', // Ścieżka do dodawania postów
    loadComponent: () => import('./components/add-post/add-post').then(m => m.AddPostComponent),
    canActivate: [authGuard] // Zabezpieczenie dodawania
  },
  {
    path: 'blog/edit/:id',
    loadComponent: () => import('./components/edit-post/edit-post.component').then(m => m.EditPostComponent),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./components/blog/blog.component').then(m => m.BlogComponent),
    canActivate: [authGuard]
  }
];