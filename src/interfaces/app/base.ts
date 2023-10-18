export default interface BaseEntity {
  readonly id: string;
}

export interface DeletableEntity {
  readonly deletedAt: number;
  readonly deletedBy: string;
}
