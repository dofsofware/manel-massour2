export interface IEngagement {
  id?: number;
}

export class Engagement implements IEngagement {
  constructor(public id?: number) {}
}

export function getEngagementIdentifier(engagement: IEngagement): number | undefined {
  return engagement.id;
}
