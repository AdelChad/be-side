import { Activities } from "src/activities/activities.entity";
import { Planning } from "src/planning/planning.entity";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ActivityDay extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    date: Date

    @ManyToOne(() => Activities, (activity) => activity.name)
    morningActivity: Activities

    @ManyToOne(() => Activities, (activity) => activity.name)
    noondayActivity: Activities

    @ManyToOne(() => Activities, (activity) => activity.name)
    afternoonActivity: Activities

    @ManyToOne(() => Activities, (activity) => activity.name)
    eveningActivity: Activities

    @ManyToOne(() => Activities, (activity) => activity.name)
    nightActivity: Activities

    @ManyToOne(() => Planning, (planning) => planning.activitiesDay)
    planning: Planning
}