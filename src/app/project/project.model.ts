export class Project {
  public userID: number;
  public name: string;
  public desc: string;
  public deadline: Date;
  public id: string;
  public users: { id: number, role: string }[];

  constructor( userID?: number, name?: string, desc?: string, deadline?: Date, id?: string) {
    this.userID = userID;
    this.name = name;
    this.desc = desc;
    this.deadline = deadline;
    this.id = id;
    this.users = [{ id: this.userID, role: 'owner' }];
  }
}
