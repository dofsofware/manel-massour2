export interface IAcheter {
  id?: number;
}

export class Acheter implements IAcheter {
  constructor(public id?: number) {}
}

export function getAcheterIdentifier(acheter: IAcheter): number | undefined {
  return acheter.id;
}
