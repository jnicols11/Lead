export class Team {
  public projectID: string;
  public name: string;
  public leader: number;
  public members: number[];
  public id: string;

  constructor(
    projectID?: string,
    name?: string,
    leader?: number,
    members?: number[],
    id?: string
    ) {
    this.projectID = projectID;
    this.name = name;
    this.leader = leader;
    this.members = members;
    this.id = id;
  }
}
