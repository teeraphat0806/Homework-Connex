export interface LoginModel {
  Username: string;
  Password: string;
}

export interface RegisterModel {
  Username: string;
  Password: string;
  ConfirmPassword: string;
  FirstName: string;
  LastName: string;
  Age: number;
  Phone: string;
  BirthDate: Date | null;
}