import { ValidationRule } from "../models/employee.model";

export const employeeValidationRules: ValidationRule[] = [
  { column: 'name', required: true, type: 'string' },
  { column: 'email', required: true, type: 'email' },
  { column: 'designation', required: true, type: 'string' },
  { column: 'phone', required: true, type: 'phone' },
  { column: 'createdDate', required: false, type: 'date' },
  { column: 'managerId', required: false, type: 'number' },
  { column: 'departmentId', required: true, type: 'number' },
];