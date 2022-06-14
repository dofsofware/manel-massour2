export interface ILouer {
  id?: number;
}

export class Louer implements ILouer {
  constructor(public id?: number) {}
}

export function getLouerIdentifier(louer: ILouer): number | undefined {
  return louer.id;
}
