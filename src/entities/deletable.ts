import { Column, Index, VersionColumn } from "typeorm";
import Base from "~src/entities/base";

export default class Deletable extends Base {
  @Column({ default: 0 })
  @Index()
  deletedAt: number;

  @Column({ nullable: true })
  deletedBy: string;

  @VersionColumn({ default: 0 })
  version: number;
}
