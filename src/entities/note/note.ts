import { Entity, Column, ManyToOne } from "typeorm";
import Deletable from "../deletable";
import INote, { NoteStatuses } from "~src/interfaces/entity/note";
import IBase, { DeletableEntity as IDeletableEntity } from "~src/interfaces/app/base";
import User from "~src/entities/user/user";

@Entity()
export default class Note extends Deletable implements IBase, IDeletableEntity, INote {
  @Column()
  text: string;

  @Column()
  status: NoteStatuses;

  @ManyToOne(() => User, (user: User) => user.notes, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  user: User;
}
