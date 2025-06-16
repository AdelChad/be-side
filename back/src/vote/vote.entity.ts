import { Clash } from 'src/clash/clash.entity';
import { User } from 'src/user/user.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vote extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Clash, clash => clash.votes, { onDelete: 'CASCADE' })
  clash: Clash;

  @ManyToOne(() => User, user => user.votes, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  option: 'A' | 'B';
}