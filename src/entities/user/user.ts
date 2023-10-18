import { Entity, Column, OneToMany } from "typeorm";
import { ValidateNested } from "class-validator";
import Deletable from "../deletable";
import IUser from "~src/interfaces/entity/user";
import IBase, { DeletableEntity as IDeletableEntity } from "~src/interfaces/app/base";
import Note from "~src/entities/note/note";

@Entity()
export default class User extends Deletable implements IBase, IDeletableEntity, IUser {
  @Column({ unique: true })
  tgChatId: string;

  @OneToMany(() => Note, (notes: Note) => notes.user, {
    eager: false,
    cascade: true,
  })
  @ValidateNested()
  notes: Note[];
}
