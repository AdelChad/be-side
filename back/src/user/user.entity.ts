import { Exclude } from 'class-transformer';
import { Activities } from 'src/activities/activities.entity';
import { Clash } from 'src/clash/clash.entity';
import { Role } from 'src/enum/role.enum';
import { Groupe } from 'src/groupe/groupe.entity';
import { Message } from 'src/message/message.entity';
import { Planning } from 'src/planning/planning.entity';
import { Restaurant } from 'src/restaurant/restaurant.entity';
import { Vote } from 'src/vote/vote.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @Exclude()
    id: number;

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    @Exclude()
    phoneNumber: string

    @Column()
    @Exclude()
    password: string

    @Column()
    country: string

    @Column()
    city: string

    @Column()
    dateofbirthday: Date

    @Column({ unique: true })
    email: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dateJoined: Date;

    @Column({ type: 'enum', enum: Role, default: Role.User })
    @Exclude()
    role: Role;

    @Column({ nullable: true })
    profilePicture: string;

    @OneToMany(() => Planning, planning => planning.user)
    planning: Planning[]

    @OneToMany(() => Groupe, groupe => groupe.creator)
    groupsCreated: Groupe[];

    @ManyToMany(() => Groupe, groupe => groupe.members)
    groups: Groupe[];

    @OneToMany(() => Message, message => message.author)
    messages: Message[];

    @ManyToMany(() => Activities, activitie => activitie.favorits, { cascade: true })
    @JoinTable()
    favoritsActivities: Activities[];

    @ManyToMany(() => Restaurant, restaurant => restaurant.favorits, { cascade: true })
    @JoinTable()
    favoritsRestaurants: Restaurant[];

    @OneToMany(() => Clash, clash => clash.creator)
    clashes: Clash[];

    @OneToMany(() => Vote, vote => vote.user)
    votes: Vote[];
}