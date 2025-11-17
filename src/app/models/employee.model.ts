export interface Employee {
  id: number;
  name: string;
  email: string;
  designation: string;
  phone: string;
  departmentName: string;
  managerName: string;
}


export interface ValidationRule {
  column: string;
  required?: boolean;
  type?: 'email' | 'phone' | 'number' | 'string' | 'date';
}