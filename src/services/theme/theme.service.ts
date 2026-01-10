import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private darkModeSubject = new BehaviorSubject<boolean>(false);
    darkMode$ = this.darkModeSubject.asObservable();

    constructor() {
        this.initTheme();
    }

    private initTheme(): void {
        // Check localStorage for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Use saved theme, or system preference, or default to light
        const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

        this.setTheme(isDark);
    }

    toggleTheme(): void {
        const newTheme = !this.darkModeSubject.value;
        this.setTheme(newTheme);
    }

    private setTheme(isDark: boolean): void {
        this.darkModeSubject.next(isDark);

        // Update document attribute
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }

    isDarkMode(): boolean {
        return this.darkModeSubject.value;
    }
}
