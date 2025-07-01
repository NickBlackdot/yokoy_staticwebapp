import { Component } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent {
  constructor(private users: UserService) {}

  remove(id: string) {
    this.users.inactivate(id).subscribe({
      next: () => alert(`User ${id} inactivated ✅`),
      error: err => alert('Request failed: ' + err.status),
    });
  }
}
