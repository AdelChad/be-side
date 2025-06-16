import { Clash } from "src/clash/clash.entity";
import { Groupe } from "src/groupe/groupe.entity";
import { Message } from "src/message/message.entity";
import { User } from "src/user/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Channel extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Groupe, groupe => groupe.channels)
    groupe: Groupe;

    @OneToMany(() => Message, message => message.channel)
    messages: Message[];

    @OneToMany(() => Clash, clash => clash.channel)
    clashes: Clash[];
}
