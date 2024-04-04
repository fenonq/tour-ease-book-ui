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
    private fb: FormBuilder,
    private httpService: HttpService,
    private authorizationService: AuthorizationService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const signInRq = {
      username: this.loginForm.controls['username'].value,
      password: this.loginForm.controls['password'].value
    } as SignInRequest;

    this.httpService.post('http://localhost:8765/signIn', signInRq).subscribe({
      next: (response) => {
        this.authorizationService.setJwtToken(response);
        this.router.navigate(['']);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
