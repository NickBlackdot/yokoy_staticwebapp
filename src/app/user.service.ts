import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = `${environment.apiBase}/api/users`;   // ✅ keep this

  constructor(private http: HttpClient) {}

  /** Soft-delete (inactivate) a user by ID */
  inactivate(id: string) {
    // 🔴 remove “${this.suffix}”
    return this.http.delete(`${this.base}/${id}`, {
      observe: 'response',
    });
  }
}
