import { User } from "src/user/user.entity";
import { Channel } from "src/channel/channel.entity"; 
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Groupe extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.groupsCreated)
    creator: User;

    @Column("text")
    groupeName: string;

    @ManyToMany(() => User, user => user.groups)
    @JoinTable()
    members: User[];

    @OneToMany(() => Channel, channel => channel.groupe)
    channels: Channel[];
}