import { Channel } from "src/channel/channel.entity"; 
import { User } from "src/user/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    content: string;

    @ManyToOne(() => User, user => user.messages)
    author: User;

    @ManyToOne(() => Channel, channel => channel.messages)
    channel: Channel;

    @CreateDateColumn()
    createdAt: Date;
}
