import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  statusActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = `${environment.apiBase}/api/users`;

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<User[]>(this.base);
  }

  bulk(action: 'inactivate' | 'delete', ids: string[]) {
    return this.http.post<{ action: string; items: any[] }>(
      `${this.base}/bulk`,
      { action, user_ids: ids }
    );
  }
}
