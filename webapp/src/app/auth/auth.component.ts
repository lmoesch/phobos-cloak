import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { PhElementsModule } from '../../../lib/phobos-elements/ph-elements.module';
import {} from '@angular/common/http';

@Component({
    selector: 'app-auth',
    imports: [
        PhElementsModule,
    ],
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  public username: string = '';
  public password: string = '';

  constructor(private readonly authService: AuthService, private readonly router: Router, private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  public async login() {
    try {
      const jwt = await this.authService.requestJwt(this.username, this.password);
      this.router.navigateByUrl('/dashboard');
    }
    catch(e){

    }
  }

}
