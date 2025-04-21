import { Injectable } from "@nestjs/common";
import { CategActiv } from "src/categ_activ/categ_activ.entity";
import { CategRestau } from "src/categ_restau/categ_restau.entity";
import { DayTime, Place } from "src/enum/detailActivity";
import { ActivityType  } from "src/interface/categActivInterface";

@Injectable()
export class GoogleFunction {

    private tagsTable: { [key: string]: ActivityType } = {
        'Stade Sportif': { tags: {name: 'Stade Sportif', subCategory: ['athletic_field', 'stadium']}, periods: [DayTime.AFTERNOON], place: Place.OUTSIDE },
        'Salle de Sport': { tags: {name: 'Salle de Sport', subCategory: ['fitness_center', 'gym', 'sports_club', 'sports_complex']}, periods: [DayTime.MORNING, DayTime.AFTERNOON, DayTime.EVENING], place: Place.INSIDE },
        'Librairie': { tags: {name: 'Librairie', subCategory: ['bookstore', 'library']}, periods: [DayTime.MORNING, DayTime.AFTERNOON, DayTime.NOONDAY], place: Place.INSIDE },
        "Parc d'Attraction": { tags: {name: "Parc d'Attraction", subCategory: ['amusement_park']}, periods: [DayTime.AFTERNOON], place: Place.OUTSIDE },
        'Parc': { tags: {name: 'Parc', subCategory: ['park']}, periods: [DayTime.MORNING, DayTime.AFTERNOON], place: Place.OUTSIDE },
        'Cours de Golf': { tags: {name: 'Cours de Golf', subCategory: ['golf_course']}, periods: [DayTime.MORNING, DayTime.AFTERNOON], place: Place.OUTSIDE },
        'Air de Jeux': { tags: {name: 'Air de Jeux', subCategory: ['playground']}, periods: [DayTime.AFTERNOON], place: Place.OUTSIDE },
        'Piscine': { tags: {name: 'Piscine', subCategory: ['swimming_pool']}, periods: [DayTime.MORNING, DayTime.AFTERNOON], place: Place.INSIDE },
        'Musée': { tags: {name: 'Musée', subCategory: ['museum']}, periods: [DayTime.MORNING], place: Place.INSIDE },
        "Galerie d'Art": { tags: {name: "Galerie d'Art", subCategory: ['art_gallery']}, periods: [DayTime.MORNING, DayTime.NOONDAY], place: Place.INSIDE },
        'Attraction Tourristique': { tags: {name: 'Attraction Tourristique', subCategory: ['tourist_attraction']}, periods: [DayTime.MORNING, DayTime.AFTERNOON], place: Place.OUTSIDE },
        'Aquarium': { tags: {name: 'Aquarium', subCategory: ['aquarium']}, periods: [DayTime.NOONDAY], place: Place.INSIDE },
        'Zoo': { tags: {name: 'Zoo', subCategory: ['zoo']}, periods: [DayTime.AFTERNOON], place: Place.OUTSIDE },
        'Boite de Nuit': { tags: {name: 'Boite de Nuit', subCategory: ['night_club']}, periods: [DayTime.NIGHT], place: Place.INSIDE },
        'Casino': { tags: {name: 'Casino', subCategory: ['casino']}, periods: [DayTime.NIGHT], place: Place.INSIDE },
        'Bowling': { tags: {name: 'Bowling', subCategory: ['bowling_alley']}, periods: [DayTime.AFTERNOON, DayTime.NIGHT], place: Place.INSIDE },
        'Cinema': { tags: {name: 'Cinema', subCategory: ['movie_theater']}, periods: [DayTime.NOONDAY, DayTime.NIGHT], place: Place.INSIDE },
        'Vidéo Club': { tags: {name: 'Vidéo Club', subCategory: ['movie_rental']}, periods: [DayTime.NOONDAY], place: Place.INSIDE },
        'Spa': { tags: {name: 'Spa', subCategory: ['spa']}, periods: [DayTime.MORNING], place: Place.INSIDE },
        'Magasin de Vêtement': { tags: {name: 'store', subCategory: ['clothing_store', 'shopping_mall']}, periods: [DayTime.MORNING, DayTime.NOONDAY, DayTime.AFTERNOON], place: Place.INSIDE },
        'Bar': { tags: {name: 'Bar', subCategory: ['bar']}, periods: [DayTime.NIGHT], place: Place.INSIDE },
        'Cafe': { tags: {name: 'Cafe', subCategory: ['cafe', 'coffee_shop']}, periods: [DayTime.MORNING, DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Restaurant Americain': { tags: {name: 'restaurant', subCategory: ['american_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Steak House': { tags: {name: 'restaurant', subCategory: ['barbecue_restaurant', 'steak_house']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Restaurant Brésilien': { tags: {name: 'restaurant', subCategory: ['brazilian_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Restaurant Brunch': { tags: {name: 'restaurant', subCategory: ['breakfast_restaurant', 'brunch_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Restaurant Chinois': { tags: {name: 'restaurant', subCategory: ['chinese_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Fast Food': { tags: {name: 'restaurant', subCategory: ['fast_food_restaurant', 'sandwich_shop']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Restaurant': { tags: {name: 'restaurant', subCategory: ['french_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE},
        'Restaurant Grec': { tags: {name: 'restaurant', subCategory: ['greek_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Restaurant de Burger': { tags: {name: 'restaurant', subCategory: ['hamburger_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Magasin de Glaces': { tags: {name: 'restaurant', subCategory: ['ice_cream_shop']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Restaurant Indien': { tags: {name: 'restaurant', subCategory: ['indian_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Restaurant Indonésien': { tags: {name: 'restaurant', subCategory: ['indonesian_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Restaurant Italien': { tags: {name: 'restaurant', subCategory: ['italian_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Restaurant Japonais': { tags: {name: 'restaurant', subCategory: ['japanese_restaurant', 'ramen_restaurant', 'sushi_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Restaurant Coréen': { tags: {name: 'restaurant', subCategory: ['korean_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Restaurant Libanais': { tags: {name: 'restaurant', subCategory: ['lebanese_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Restaurant Méditerranéen': { tags: {name: 'restaurant', subCategory: ['mediterranean_restaurant', 'seafood_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Restaurant Mexicain': { tags: {name: 'restaurant', subCategory: ['mexican_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Restaurant Oriental': { tags: {name: 'restaurant', subCategory: ['middle_eastern_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Pizzeria': { tags: {name: 'restaurant', subCategory: ['pizza_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Restaurant Espagnole': { tags: {name: 'restaurant', subCategory: ['spanish_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Restaurant Thaï': { tags: {name: 'restaurant', subCategory: ['thai_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Restaurant Turc': { tags: {name: 'restaurant', subCategory: ['turkish_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Restaurant Vegan': { tags: {name: 'restaurant', subCategory: ['vegan_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Restaurant Végétarien': { tags: {name: 'restaurant', subCategory: ['vegetarian_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
        'Restaurant Vietnamien': { tags: {name: 'restaurant', subCategory: ['vietnamese_restaurant']}, periods: [DayTime.NOONDAY, DayTime.EVENING], place: Place.INSIDE },
    };

    public getTagFr(tag: string) {
        for (let key in this.tagsTable) {
            let value: ActivityType = this.tagsTable[key]

            if (value.tags.subCategory.find((result) => tag == result) != undefined) {
                return this.tagsTable[key].tags
            }
        }
    }

    public getPeriods(tag: string) : Array<DayTime>{
        for (let key in this.tagsTable) {
            let value: ActivityType = this.tagsTable[key]

            if (value.tags.subCategory.find((result) => tag == result) != undefined) {
                return value.periods
            }
        }
    }


    public getPlace(tag: string) : Place{
        for (let key in this.tagsTable) {
            let value: ActivityType = this.tagsTable[key]

            if (value.tags.subCategory.find((result) => tag == result) != undefined) {
                return value.place
            }
        }
    }

    public async insertCategs() {
        const motsInterdits = ["restaurant", "food", "cafe", "bar", "steak", "pizzeria", "glaces"];
        
        for (let key in this.tagsTable) {
            if (motsInterdits.some(mot => key.toLowerCase().includes(mot))) {
                let categ_activ = new CategRestau();
                categ_activ.name = key;
                await categ_activ.save();
                console.log(categ_activ);
            }
        }
    }
}