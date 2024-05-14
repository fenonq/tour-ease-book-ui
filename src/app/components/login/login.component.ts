import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf, NgOptimizedImage} from "@angular/common";
import {HttpService} from "../../services/http.service";
import {AuthorizationService} from "../../services/authorization.service";
import {Router} from "@angular/router";

export interface SignInRequest {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgClass,
    NgOptimizedImage
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private authorizationService: AuthorizationService
  ) {
  }

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.controls;

    const signInRequest: SignInRequest = {
      username: username.value,
      password: password.value
    };

    this.httpService.post('http://localhost:8765/signIn', signInRequest).subscribe({
      next: (response) => {
        this.authorizationService.setJwtToken(response.accessToken);
        this.router.navigate(['']);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }

}
