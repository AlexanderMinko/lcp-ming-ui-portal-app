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
import { CreateAccountParam } from '../../model/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  authFormGroup: FormGroup;
  errorMessage: string;
  url: string | ArrayBuffer | null | undefined = 'assets/images/avatar/BasePhoto.jpg';

  constructor(
    public activeModal: NgbActiveModal,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authFormGroup = this.formBuilder.group(
      {
        username: new FormControl(
          '',
          [Validators.required, Validators.minLength(2), this.notOnlyWhitespace],
          this.fieldValidator('username')
        ),
        firstname: new FormControl('', [Validators.required, Validators.minLength(2), this.notOnlyWhitespace]),
        lastname: new FormControl('', [Validators.required, Validators.minLength(2), this.notOnlyWhitespace]),
        email: new FormControl(
          '',
          [Validators.required, Validators.pattern('[a-z0-9._-]+@[a-z0-9.-]+\\.[a-z]{2,4}')],
          this.fieldValidator('email')
        ),
        password: new FormControl('', [Validators.required, Validators.minLength(3)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(3)]),
        image: new FormControl(''),
      },
      { validators: this.checkPasswordMatch }
    );
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
  get image(): AbstractControl | null {
    return this.authFormGroup.get('image');
  }

  onSubmit(): void {
    this.registration();
  }

  private registration(): void {
    if (this.authFormGroup.invalid) {
      this.authFormGroup.markAllAsTouched();
    } else {
      const createAccountParam = {
        username: this.username?.value,
        firstName: this.firstname?.value,
        lastName: this.lastname?.value,
        email: this.email?.value,
        password: this.password?.value,
      } as CreateAccountParam;
      this.authService.customRegistrationAccount(createAccountParam, this.image?.value).subscribe(() => {
        this.activeModal.dismiss('Cross click');
        this.toastr.success('Account successfully registered. You can sign in.', '', {
          closeButton: true
        });
      });
    }
  }

  onFileChanged(event: Event): void {
    const files: FileList = (event.target as HTMLInputElement).files as FileList;
    this.authFormGroup.patchValue({
      image: files[0],
    });
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (readerEvent) => {
      this.url = readerEvent?.target?.result;
    };
  }
}
