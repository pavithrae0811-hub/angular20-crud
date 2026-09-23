import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.scss'
})
export class EmployeeForm implements OnInit {

  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  employeeId: string | null = null;

  isEditMode = false;

  employeeForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [
      Validators.required,
      Validators.email
    ]],
    department: ['', Validators.required],
    salary: [0, [
      Validators.required,
      Validators.min(1)
    ]]
  });

  ngOnInit(): void {

    this.employeeId = this.route.snapshot.paramMap.get('id');

    if (this.employeeId) {
      this.isEditMode = true;
      this.loadEmployee(this.employeeId);
    }
  }

  loadEmployee(id: string): void {

    this.employeeService.getEmployees().subscribe({
      next: (employees) => {

        const employee = employees.find(
          item => item.id === id
        );

        if (employee) {

          this.employeeForm.patchValue({
            name: employee.name,
            email: employee.email,
            department: employee.department,
            salary: employee.salary
          });

        }

      },
      error: (error) => {
        console.error('Error loading employee:', error);
      }
    });
  }

  saveEmployee(): void {

    if (this.employeeForm.invalid) {

      this.employeeForm.markAllAsTouched();

      return;
    }

    const employee = this.employeeForm.getRawValue();

    if (this.isEditMode && this.employeeId) {

      this.employeeService
        .updateEmployee(this.employeeId, employee)
        .subscribe({
          next: () => {
            this.router.navigate(['/employees']);
          },
          error: (error) => {
            console.error('Error updating employee:', error);
          }
        });

    } else {

      this.employeeService
        .addEmployee(employee)
        .subscribe({
          next: () => {
            this.router.navigate(['/employees']);
          },
          error: (error) => {
            console.error('Error adding employee:', error);
          }
        });

    }
  }
}
