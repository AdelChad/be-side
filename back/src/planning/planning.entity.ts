import { Activities } from "src/activities/activities.entity";
import { ActivityDay } from "src/activity_day/activity-day.entity";
import { Groupe } from "src/groupe/groupe.entity";
import { User } from "src/user/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Planning extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    name?: string | null

    @OneToMany(() => ActivityDay, (activityDay) => activityDay.planning)
    activitiesDay: ActivityDay[]

    @ManyToOne(() => User, user => user.planning, { nullable: false })
    user: User

    @ManyToOne(() => Groupe, groupe => groupe.planning)
    group: Groupe;
}