import { Column, Entity } from 'typeorm';

import { BaseEntity } from 'src/BaseEntity';

@Entity()
export class User extends BaseEntity {
  @Column()
  username: string;
  @Column({ unique: true, nullable: true })
  email: string;
  @Column()
  password: string;
  @Column({ nullable: true })
  phone: string;
}
