import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./core/auth/auth.component').then(c => c.AuthComponent),
    },
    {
        path: '',
        loadComponent: () => import('./core/layout/main/main.component').then(c => c.MainComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./feature/home/home.component').then(c => c.HomeComponent),
            },
            {
                path: 'editor',
                loadComponent: () => import('./feature/editor/editor.component').then(c => c.EditorComponent),
            },
            {
                path: 'library',
                loadComponent: () => import('./feature/library/library.component').then(c => c.LibraryComponent),
                children: [
                    {
                        path: 'volumes',
                        loadComponent: () => import('./feature/library/volumes/volumes.component').then(c => c.VolumesComponent),
                    },
                    {
                        path: 'books',
                        loadComponent: () => import('./feature/library/books/books.component').then(c => c.BooksComponent),
                    },
                    {
                        path: 'languages',
                        loadComponent: () => import('./feature/library/languages/languages.component').then(c => c.LanguagesComponent),
                    }
                ]
            },
            {
                path: 'user',
                loadComponent: () => import('./feature/user/user.component').then(c => c.UserComponent),
            },
            {
                path: 'charts',
                loadComponent: () => import('./features/charts/charts.component').then(c => c.ChartsComponent),
            },
        ]
    },
    {
        path: '**',
        loadComponent: () => import('./core/page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent)
    }
];