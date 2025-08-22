import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorage {
  // set item in local storage
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  // get item from local storage
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  // remove item from local storage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // remove all items from local storage
  removeAllItems(): void {
    localStorage.clear();
  }
}
