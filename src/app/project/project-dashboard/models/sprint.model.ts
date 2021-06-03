import { Issue } from "./issue.model";

export class Sprint {
  public projectID: string;
  public userID: string;
  public name: string;
  public issues: Issue[]
  public id: string;

  constructor(projectID?: string, userID?: string, name?: string, issues?: Issue[], id?: string) {
    this.projectID = projectID;
    this.userID = userID;
    this.name = name;
    this.issues = issues;
    this.id = id;
  }
}
