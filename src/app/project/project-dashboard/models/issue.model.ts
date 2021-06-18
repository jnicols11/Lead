export class Issue {
  public projectID: string;
  public backlogID: string;
  public sprintID: string;
  public userID: string;
  public name: string;
  public desc: string;
  public time: number;
  public state: number;
  public id: string;

  constructor(projectID?: string, name?: string, desc?: string, time?: number, backlogID?: string, sprintID?: string, userID?: string, state?: number, id?: string) {
    this.projectID = projectID;
    this.name = name;
    this.desc = desc;
    this.time = time;
    this.backlogID = backlogID;
    this.sprintID = sprintID;
    this.userID = userID;
    this.state = state;
    this.id = id;
  }
}
