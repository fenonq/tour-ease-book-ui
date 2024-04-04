import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf, NgOptimizedImage} from "@angular/common";
import {HttpService} from "../../services/http.service";
import {AuthorizationService} from "../../services/authorization.service";
import {Router} from "@angular/router";

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass,
    NgOptimizedImage
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private httpService: HttpService,
    private authorizationService: AuthorizationService
  ) {
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      return;
    }

    const signUpRq = {
      username: this.registrationForm.controls['username'].value,
      email: this.registrationForm.controls['email'].value,
      password: this.registrationForm.controls['password'].value
    } as SignUpRequest;

    this.httpService.post('http://localhost:8765/signUp', signUpRq).subscribe({
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
