import { DayTime, Place } from "src/enum/detailActivity";
import { CategActiv } from "src/categ_activ/categ_activ.entity";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Activities extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column()
    country: string

    @Column()
    address: string

    @Column()
    price: string

    @Column()
    description: string

    @Column()
    city: string

    @Column({ nullable: true })
    latitude: string

    @Column({ nullable: true })
    longitude: string

    @Column({type: 'float', default: 0.0})
    rating: number

    @Column({type: "set", enum: DayTime})
    dayTime : Array<DayTime>

    @Column({type: "enum", enum: Place})
    place: string

    @Column()
    phoneNumber: string

    @Column({ type: "json" })
    periods: string

    @Column({ nullable: true })
    googleId: string

    @Column({ default: false })
    isBook: Boolean

    @ManyToMany(() => CategActiv)
    @JoinTable()
    categActiv: CategActiv[]
}