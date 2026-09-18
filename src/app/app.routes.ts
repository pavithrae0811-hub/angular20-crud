import { Routes } from '@angular/router';

import { EmployeeList } from './components/employee-list/employee-list';
import { EmployeeForm } from './components/employee-form/employee-form';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'employees',
    pathMatch: 'full'
  },
  {
    path: 'employees',
    component: EmployeeList
  },
  {
    path: 'employees/add',
    component: EmployeeForm
  },
  {
    path: 'employees/edit/:id',
    component: EmployeeForm
  }
];