import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { User } from './user.service';

@Component({
  selector: 'user-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCheckboxModule
  ],
  template: `
<mat-table [dataSource]="ds">

  <ng-container matColumnDef="select">
    <mat-header-cell *matHeaderCellDef>
      <mat-checkbox (change)="toggleAll($event.checked)"></mat-checkbox>
    </mat-header-cell>
    <mat-cell *matCellDef="let u">
      <mat-checkbox [(ngModel)]="selection[u.id]" (change)="emit()"></mat-checkbox>
    </mat-cell>
  </ng-container>

  <ng-container matColumnDef="name">
    <mat-header-cell *matHeaderCellDef>Name</mat-header-cell>
    <mat-cell  *matCellDef="let u">{{u.firstName}} {{u.lastName}}</mat-cell>
  </ng-container>

  <ng-container matColumnDef="email">
    <mat-header-cell *matHeaderCellDef>Email</mat-header-cell>
    <mat-cell *matCellDef="let u">{{u.email}}</mat-cell>
  </ng-container>

  <ng-container matColumnDef="status">
    <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
    <mat-cell *matCellDef="let u">
      <span [style.color]="u.statusActive ? 'green':'grey'">
        {{ u.statusActive ? 'active' : 'inactive' }}
      </span>
    </mat-cell>
  </ng-container>

  <mat-header-row *matHeaderRowDef="cols"></mat-header-row>
  <mat-row        *matRowDef="let row; columns: cols"></mat-row>
</mat-table>
`,
  styles: [`mat-table {width:100%}`]
})
export class UserTableComponent {
  @Input() set users(u:User[]) { this.ds.data = u }
  @Output() selectionChange = new EventEmitter<string[]>();

  cols = ['select','name','email','status'];
  ds = new MatTableDataSource<User>();

  selection: Record<string, boolean> = {};

  toggleAll(checked:boolean){
    this.ds.data.forEach(u=> this.selection[u.id] = checked);
    this.emit();
  }
  emit(){
    this.selectionChange.emit(
      Object.entries(this.selection)
            .filter(([_,v])=>v)
            .map(([k])=>k)
    );
  }
}
