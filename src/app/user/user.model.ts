export class User {
  public name: string;
  public username: string;
  public email: string;
  public password: string;
  public id: number;
  public role: string

  constructor( name: string, username: string, email: string, password?: string, id?: number, role?: string) {
    this.name = name;
    this.username = username;
    this.email = email;
    this.password = password;
    this.id = id;
    this.role = role;
  }
}
