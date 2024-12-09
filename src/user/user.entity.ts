import { Role } from 'src/enum/role.enum';
import { Groupe } from 'src/groupe/groupe.entity';
import { Message } from 'src/message/message.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';

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

    @OneToMany(() => Groupe, groupe => groupe.creator)
    groupsCreated: Groupe[];

    @ManyToMany(() => Groupe, groupe => groupe.members)
    groups: Groupe[];

    @OneToMany(() => Message, message => message.author)
    messages: Message[];
}