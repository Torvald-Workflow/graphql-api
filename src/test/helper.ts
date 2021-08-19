import { CreateUserDto } from '../users/dto/createUser.dto';

export class UserTest {
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _password: string;

  constructor(email, firstName, lastName, password) {
    this._email = email;
    this._firstName = firstName;
    this._lastName = lastName;
    this._password = password;
  }

  getEmail(): string {
    return this._email;
  }

  getFirstName(): string {
    return this._firstName;
  }

  getLastName(): string {
    return this._lastName;
  }

  getPassword(): string {
    return this._password;
  }
}

export const adminUser = new UserTest(
  'admin@test.fr',
  'Admin',
  'Admin',
  'adminpassword',
);

export const localUser = new UserTest(
  'test@test.fr',
  'John',
  'Doe',
  'userpassword',
);

export const adminUserDto = (): CreateUserDto => {
  return {
    firstName: adminUser.getFirstName(),
    lastName: adminUser.getLastName(),
    email: adminUser.getEmail(),
    password: adminUser.getPassword(),
  };
};

export const userDto = (): CreateUserDto => {
  return {
    firstName: localUser.getFirstName(),
    lastName: localUser.getLastName(),
    email: localUser.getEmail(),
    password: localUser.getPassword(),
  };
};
