export interface IEstimer {
  id?: number;
}

export class Estimer implements IEstimer {
  constructor(public id?: number) {}
}

export function getEstimerIdentifier(estimer: IEstimer): number | undefined {
  return estimer.id;
}
