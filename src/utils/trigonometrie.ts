import { Injectable } from "@nestjs/common";
import { Activities } from "src/activities/activities.entity";
import { GeocodeAddresse } from "src/interface/geocodeAddresse";

@Injectable()
export class Trigonometrie {

    //loi d'haversin aller voir si ça vous intéresse 
    distance(positionUser: GeocodeAddresse, activities: Activities, radius: number = 5): boolean {
        const R = 6371; //Rayon de la terre en Kilomètre By google c'est important dans les calcules trigonométrique comme celui ci-dessous 

        const lat1 = positionUser.lat
        const lat2 = Number(activities.latitude)
        const long1 = positionUser.long
        const long2 = Number(activities.longitude)

        const radiantLatitude1 = this.degreeToRadians(lat1)
        const radiantLatitude2 = this.degreeToRadians(lat2)

        const differenceRadiantLat = this.degreeToRadians(lat2 - lat1);
        const differenceRadiantLong = this.degreeToRadians(long2 - long1);

        const a = Math.sin(differenceRadiantLat / 2) * Math.sin(differenceRadiantLat / 2) +
            Math.cos(radiantLatitude1) * Math.cos(radiantLatitude2) *
            Math.sin(differenceRadiantLong / 2) * Math.sin(differenceRadiantLong / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

        const d = R * c;

        return d <= radius;
    }

    private degreeToRadians(number: number): number {
        return number * Math.PI / 180
    }


    private radiansToDegree(number: number): number {
        return number * 180 / Math.PI
    }

}
