import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '@user/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
  ],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss',
})
export class UserCreateComponent {
  constructor(
    private fb: FormBuilder,
    private userSvc: UserService,
    private dialogRef: MatDialogRef<UserCreateComponent>
  ) {}
  symbols: string = '@$!%*?&#';

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
        ),
      ],
    ],
    userName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
  });
  createUser() {
    if (this.form.valid) {
      this.userSvc.createUser(this.form.value).subscribe((res) => {
        Swal.fire({
          title: 'Usuario creado',
          text: 'Se ha enviado un correo de verificación a su email para activar su cuenta de usuario en la aplicación. Por favor, revise su bandeja de entrada',
          icon: 'success',
        });
        this.dialogRef.close();
      });
    } else this.form.markAllAsTouched();
  }
}
