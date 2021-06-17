import { Issue } from "./issue.model";

export class Sprint {
  public projectID: string;
  public teamID: string;
  public name: string;
  public issues: Issue[]
  public id: string;

  constructor(projectID?: string, teamID?: string, name?: string, issues?: Issue[], id?: string) {
    this.projectID = projectID;
    this.teamID = teamID;
    this.name = name;
    this.issues = issues;
    this.id = id;
  }
}
