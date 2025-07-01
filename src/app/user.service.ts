import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = `${environment.apiBase}/api/users`;   // ✅ keep this

  constructor(private http: HttpClient) {}

/** Soft-delete user via POST body */
  inactivate(id: string) {
    const body = {
      action: 'inactivate',
      org_id: 'ky6IdK9ph',      // ← put the real org id here
      user_ids: [id]
    };

    return this.http.post(
      `${environment.apiBase}/api/users`,
      body,
      { observe: 'response' }
    );
  }
}
