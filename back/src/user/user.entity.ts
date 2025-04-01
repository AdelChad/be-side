import { Activities } from 'src/activities/activities.entity';
import { Role } from 'src/enum/role.enum';
import { Groupe } from 'src/groupe/groupe.entity';
import { Message } from 'src/message/message.entity';
import { Planning } from 'src/planning/planning.entity';
import { Restaurant } from 'src/restaurant/restaurant.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    phoneNumber: string

    @Column()
    password: string

    @Column()
    country: string

    @Column()
    city: string

    @Column()
    dateofbirthday: Date

    @Column({ unique: true })
    email: string

    @Column()
    dateJoined: Date

    @Column({ type: 'enum', enum: Role, default: Role.User })
    role: Role;

    @OneToMany(() => Planning, planning => planning.user)
    planning: Planning[]

    @OneToMany(() => Groupe, groupe => groupe.creator)
    @JoinTable()
    groupsCreated: Groupe[];

    @ManyToMany(() => Groupe, groupe => groupe.members)
    @JoinTable()
    groups: Groupe[];

    @OneToMany(() => Message, message => message.author)
    @JoinTable()
    messages: Message[];

    @ManyToMany(() => Activities, activitie => activitie.favorits, { cascade: true })
    @JoinTable()
    favoritsActivities: Activities[];

    @ManyToMany(() => Restaurant, restaurant => restaurant.favorits, { cascade: true })
    @JoinTable()
    favoritsRestaurants: Restaurant[];
}