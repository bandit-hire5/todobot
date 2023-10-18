import { PrimaryGeneratedColumn, Column } from "typeorm";

export default class Base {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: 0 })
  createdAt: number;

  @Column({ default: 0 })
  updatedAt: number;
}
