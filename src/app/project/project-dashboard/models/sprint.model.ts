import { Issue } from "./issue.model";
import { Team } from "./team.model";

export class Sprint {
  public projectID: string;
  public team: Team;
  public name: string;
  public issues: Issue[];
  public deadline: Date;
  public id: string;

  constructor(projectID?: string, team?: Team, name?: string, issues?: Issue[], deadline?: Date, id?: string) {
    this.projectID = projectID;
    this.team = team;
    this.name = name;
    this.issues = issues;
    this.deadline = deadline;
    this.id = id;
  }
}
