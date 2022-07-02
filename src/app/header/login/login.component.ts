import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../service/auth.service';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RegistrationRequest } from '../../model/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  authFormGroup: FormGroup;
  errorMessage: string;

  constructor(
    public activeModal: NgbActiveModal,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.authFormGroup = this.formBuilder.group({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        this.notOnlyWhitespace,
      ]),
      firstname: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        this.notOnlyWhitespace,
      ]),
      lastname: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        this.notOnlyWhitespace,
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-z0-9._-]+@[a-z0-9.-]+\\.[a-z]{2,4}'),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  notOnlyWhitespace(control: FormControl): ValidationErrors | null {
    if (control.value != null && control.value.trim().length === 0) {
      return { notOnlyWhitespace: true };
    } else {
      return null;
    }
  }

  fieldValidator(controlName: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.authService.isUserExist(controlName, control.value).pipe(
        map((res) => {
          return res ? { [controlName + 'Exists']: true } : null;
        })
      );
    };
  }

  checkPasswordMatch(group: FormGroup): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { doNotMatch: true };
  }

  get username(): AbstractControl | null {
    return this.authFormGroup.get('username');
  }
  get email(): AbstractControl | null {
    return this.authFormGroup.get('email');
  }
  get password(): AbstractControl | null {
    return this.authFormGroup.get('password');
  }
  get firstname(): AbstractControl | null {
    return this.authFormGroup.get('firstname');
  }
  get lastname(): AbstractControl | null {
    return this.authFormGroup.get('lastname');
  }
  get confirmPassword(): AbstractControl | null {
    return this.authFormGroup.get('confirmPassword');
  }

  onSubmit(): void {
    this.registration();
  }

  private registration(): void {
    if (this.authFormGroup.invalid) {
      this.authFormGroup.markAllAsTouched();
    } else {
      const registrationRequest = {
        username: this.username?.value,
        firstName: this.firstname?.value,
        lastName: this.lastname?.value,
        email: this.email?.value,
        password: this.password?.value,
      } as RegistrationRequest;
      this.authService.customRegistrationAccount(registrationRequest).subscribe((data) => {
        this.activeModal.dismiss('Cross click');
      });
    }
  }
}
