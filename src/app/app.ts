import { Component, inject } from '@angular/core';

import { MatSnackBar }       from '@angular/material/snack-bar';
import { MatSelectModule }   from '@angular/material/select';
import { MatButtonModule }   from '@angular/material/button';
import { FormsModule }       from '@angular/forms';
import { MatSnackBarModule }   from '@angular/material/snack-bar';
import { CommonModule }        from '@angular/common';

import { UserService, User } from './user.service';
import { UserTableComponent } from './user-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    UserTableComponent
  ],
  template: `
<h2>Yokoy User Admin</h2>

<user-table [users]="users"
            (selectionChange)="selected = $event">
</user-table>

<div style="margin-top:20px">
  <mat-select [(ngModel)]="action" placeholder="Action">
    <mat-option value="inactivate">Inactivate</mat-option>
    <mat-option value="delete">Delete</mat-option>
  </mat-select>

  <button mat-raised-button color="primary"
          (click)="run()" [disabled]="!selected.length || !action">
    Run on {{selected.length}} user(s)
  </button>
</div>
`,

})
export class AppComponent {
  private api = inject(UserService);
  private sb  = inject(MatSnackBar);

  users: User[] = [];
  selected: string[] = [];
  action: 'inactivate' | 'delete' | null = null;

  constructor(){ this.refresh(); }

  refresh(){
    this.api.list().subscribe(u => this.users = u);
  }

  run(){
    if (this.action) {
      this.api.bulk(this.action, this.selected).subscribe(res=>{
      const ok   = res.items.filter((i:any)=>i.status==='ok').length;
      const fail = res.items.length - ok;
      this.sb.open(`${ok} OK, ${fail} failed`, 'Close', {duration:4000});
      this.refresh();
      this.selected = [];
    });
    }
  }
}
