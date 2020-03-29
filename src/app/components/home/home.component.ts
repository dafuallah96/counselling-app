import { Component, OnInit } from '@angular/core';
import { AppUser } from 'src/app/models/appuser';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  appUser: AppUser;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.appUser$.subscribe(appUser => this.appUser = appUser);

  }

}
