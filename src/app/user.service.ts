import { Injectable }       from '@angular/core';
import { HttpClient }       from '@angular/common/http';
import { environment }      from '../environments/environment';

/* one user row – tweak fields as you need */
export interface User {
  id:            string;
  firstName:     string;
  lastName:      string;
  email:         string;
  statusActive:  boolean;
}

/* optional credentials coming from the Connect form */
export interface Creds {
  client_id:     string;
  client_secret: string;
  org_id:        string;
  entity_id?:    string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = `${environment.apiBase}/api/users`;

  constructor(private http: HttpClient) {}

  /** LIST
   *  • If creds are given → POST them to /list
   *  • Else                 → fall back to simple GET (your current behaviour) */
  list(creds?: Creds) {
    return creds
      ? this.http.post<User[]>(`${this.base}/list`, creds)
      : this.http.get<User[]>(this.base);
  }

  /** BULK (inactivate / delete)
   *  • If creds exist → include them in the body
   *  • Else           → keep the body exactly as before                         */
  bulk(action: 'inactivate' | 'delete', ids: string[], creds?: Creds) {
    const body = creds
      ? { ...creds, action, user_ids: ids }
      : { action,   user_ids: ids };

    return this.http.post<{ action: string; items: any[] }>(
      `${this.base}/bulk`,
      body
    );
  }
}
