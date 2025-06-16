import { Activities } from "src/activities/activities.entity";
import { Channel } from "src/channel/channel.entity";
import { Restaurant } from "src/restaurant/restaurant.entity";
import { User } from "src/user/user.entity";
import { Vote } from "src/vote/vote.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Clash extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.clashes, { nullable: false })
    creator: User;

    @ManyToOne(() => Activities, { nullable: true })
    activityOptionA: Activities;

    @ManyToOne(() => Activities, { nullable: true })
    activityOptionB: Activities;

    @ManyToOne(() => Restaurant, { nullable: true })
    restaurantOptionA: Restaurant;

    @ManyToOne(() => Restaurant, { nullable: true })
    restaurantOptionB: Restaurant;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Vote, vote => vote.clash)
    votes: Vote[];

    @ManyToOne(() => Channel, channel => channel.clashes, { nullable: false })
    channel: Channel;
}