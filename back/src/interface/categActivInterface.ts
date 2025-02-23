import { DayTime, Place } from "src/enum/detailActivity";

export interface ActivityType  {
    tags: { name: string, subCategory: string[] };
    periods: DayTime[];
    place: Place;
}