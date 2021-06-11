export class Team {
  public projectID: string;
  public name: string;
  public leader: number;
  public members: number[];

  constructor(projectID?: string, name?: string, leader?: number, members?: number[]) {
    this.projectID = projectID;
    this.name = name;
    this.leader = leader;
    this.members = members;
  }
}
