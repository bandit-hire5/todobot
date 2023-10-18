export enum SortDirections {
  ASC = "ASC",
  DESC = "DESC",
}

export type SortFields = null;

export interface Sort<TSortFields = SortFields> {
  readonly field: TSortFields;
  readonly direction: SortDirections;
}
