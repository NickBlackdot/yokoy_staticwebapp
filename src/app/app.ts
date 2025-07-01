import { Component, inject } from '@angular/core';

import { MatSnackBar }         from '@angular/material/snack-bar';
import { MatSelectModule }     from '@angular/material/select';
import { MatFormFieldModule }  from '@angular/material/form-field';
import { MatButtonModule }     from '@angular/material/button';
import { MatInputModule }      from '@angular/material/input';
import { FormsModule }         from '@angular/forms';
import { MatSnackBarModule }   from '@angular/material/snack-bar';
import { CommonModule }        from '@angular/common';

import { UserService, User, Creds } from './user.service';
import { UserTableComponent }       from './user-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    UserTableComponent
  ],
  template: `
<h2>Yokoy User Admin</h2>

<!-- ── Connect form ──────────────────────────────────────────────── -->
<div *ngIf="!connected" style="max-width:420px;margin-bottom:24px">
  <form #f="ngForm">
    <mat-form-field appearance="fill" class="w100">
      <mat-label>Client&nbsp;ID</mat-label>
      <input matInput required [(ngModel)]="creds.client_id" name="cid">
    </mat-form-field>

    <mat-form-field appearance="fill" class="w100">
      <mat-label>Client&nbsp;Secret</mat-label>
      <input matInput required type="password"
             [(ngModel)]="creds.client_secret" name="csec">
    </mat-form-field>

    <mat-form-field appearance="fill" class="w100">
      <mat-label>Org&nbsp;ID</mat-label>
      <input matInput required [(ngModel)]="creds.org_id" name="org">
    </mat-form-field>

    <mat-form-field appearance="fill" class="w100">
      <mat-label>Entity&nbsp;ID&nbsp;(optional)</mat-label>
      <input matInput [(ngModel)]="creds.entity_id" name="ent">
    </mat-form-field>

    <button mat-raised-button color="primary"
            (click)="connect()" [disabled]="f.invalid">
      Connect
    </button>
  </form>
</div>

<!-- ── Users table + bulk actions (visible only after Connect) ───── -->
<div *ngIf="connected">
  <user-table [users]="users"
              (selectionChange)="selected = $event">
  </user-table>

  <div style="margin-top:24px">
    <mat-form-field appearance="fill" style="width:220px">
      <mat-label>Action</mat-label>
      <mat-select [(ngModel)]="action">
        <mat-option value="inactivate">Inactivate</mat-option>
        <mat-option value="delete">Delete</mat-option>
      </mat-select>
    </mat-form-field>

    <button mat-raised-button color="primary"
            (click)="run()" [disabled]="!selected.length || !action">
      Run on {{selected.length}} user(s)
    </button>

    <button mat-button style="margin-left:12px" (click)="refresh()">
      Refresh list
    </button>
  </div>
</div>
`,
  styles: [`.w100{width:100%}`]
})
export class AppComponent {

  private api = inject(UserService);
  private sb  = inject(MatSnackBar);

  /* credentials entered by the user */
  creds: Creds = { client_id:'', client_secret:'', org_id:'', entity_id:'' };
  connected = false;

  /* table state */
  users: User[] = [];
  selected: string[] = [];
  action: 'inactivate' | 'delete' | null = null;

  /** called when user clicks Connect */
  connect() {
    this.connected = true;
    this.refresh();
  }

  /** fetch latest user list */
  refresh() {
    if (!this.connected) return;
    this.api.list(this.creds).subscribe((u: User[]) => (this.users = u));
  }

  /** run bulk inactivate / delete */
  run() {
    if (!this.action) return;
    this.api.bulk(this.action, this.selected, this.creds)
            .subscribe((res: any) => {
      const ok   = res.items.filter((i: any) => i.status === 'ok').length;
      const fail = res.items.length - ok;
      this.sb.open(`${ok} OK, ${fail} failed`, 'Close', { duration: 4000 });
      this.refresh();
      this.selected = [];
    });
  }
}
