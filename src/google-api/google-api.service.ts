import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Activities } from "src/activities/activities.entity";
import { GooglePlaceSearchDto } from "./dto/add-activities.dto";
import { GeocodeAddresse } from "src/interface/geocodeAddresse";
import { GoogleFunction } from "src/utils/Google";
import { InjectRepository } from "@nestjs/typeorm";
import { Tags } from "src/categ_activ/categ_activ.entity";
import { In, Repository } from "typeorm";
import { SousCategorie } from "src/sous_categorie/sousCategorie.entity";

require('dotenv').config();

@Injectable()
export class GoogleApiService {
    constructor(
        public googleFunction: GoogleFunction,

        @InjectRepository(Tags)
        public tagsRepository: Repository<Tags>,

        @InjectRepository(SousCategorie)
        public sousCategorieRepository: Repository<SousCategorie>,

        @InjectRepository(Activities)
        public activitiesRepository: Repository<Activities>,

    ) { }

    async createActivitiesBygoogle(googlePlaceSearchDto: GooglePlaceSearchDto, pageNextToken?: string) {

        const { type, lieu, radius } = googlePlaceSearchDto

        const addresseGeocode = await this.getAddresseGeocode(lieu)

        try {
            const response = await fetch(`${process.env.URL_API_GOOGLE.toString()}/place/nearbysearch/json?key=${process.env.API_KEY_GOOGLE.toString()}&radius=${radius}&keyword=${type}&type=${type}&location=${addresseGeocode.lat},${addresseGeocode.long}`, {
                method: 'GET',
            })

            const result = await response.json()
            
            if (response.ok) {
                this.createActivitiesWhatWeDo(result, type)
            } else {
                throw new HttpException(`Some probleme with google Api ${result}`, HttpStatus.INTERNAL_SERVER_ERROR)
            }
        } catch (error) {
            throw new HttpException(`Some problemes with API ${error}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }

    public async getAddresseGeocode(address: string): Promise<GeocodeAddresse> {
        const addresseEncoded = encodeURIComponent(address)
        
        
        try {
            const response = await fetch(`${process.env.URL_API_GOOGLE.toString()}/geocode/json?key=${process.env.API_KEY_GOOGLE.toString()}&address=${addresseEncoded}`)
            
            if (!response.ok) {
                throw new HttpException(`HTTP error! status: ${response.status}`, response.status);
            }
            const result = await response.json()
            
            const geocodeAddress: GeocodeAddresse = {
                lat: result.results[0].geometry.location.lat,
                long: result.results[0].geometry.location.lng
            };
            return geocodeAddress
        } catch(e) {
            console.log(e)
            throw new HttpException("The API google don't answer", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    
    private async createActivitiesWhatWeDo(result, type: string) {
        for (let place of result.results) {
            const activityExist = await this.activitiesRepository.findOneBy({ googleId: place.place_id })
            if (!activityExist) {
                try {
                    const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&key=${process.env.API_KEY_GOOGLE.toString()}&fields=formatted_address,geometry,photo,opening_hours,rating,formatted_phone_number,name,address_components`, {
                        method: 'GET'
                    })

                    const result = await response.json()
                    //TODO en fonction du timing mettre le crénaux le plus adapté
                    if (response.ok) {
                        let hourOppening = []

                        for (let planning of result.result.opening_hours.weekday_text) {
                            let matches = planning.match(/^(\w+):\s*(.*)$/);

                            if (matches) {
                                let day = matches[1];
                                let timings = matches[2];

                                let myObject = {
                                    jour: day,
                                    heure: timings
                                }
                                hourOppening = [...hourOppening, myObject]
                            }
                        }

                        let city, country

                        //TODO : Refacto pour avoir une fonction générique
                        for (let address of result.result.address_components) {
                            for (let types of address.types) {
                                if (types == 'locality') {
                                    city = address.long_name
                                }
                                if (types == 'country') {
                                    country = address.long_name
                                }
                            }
                        }

                        const tagName = this.googleFunction.getTagFr(type)
                        const daytime = this.googleFunction.getPeriods(type)
                        const spaceType = this.googleFunction.getPlace(type)
                        const tag = await this.tagsRepository.findBy({ name: tagName.name })
                        const subCategory = await this.sousCategorieRepository.findBy({ name: In(tagName.subCategory) })
                        

                        let activities = new Activities()

                        activities.name = result.result.name
                        activities.rating = result.result.rating
                        activities.phoneNumber = result.result.formatted_phone_number
                        activities.periods = JSON.stringify(hourOppening)
                        activities.latitude = result.result.geometry.location.lat
                        activities.longitude = result.result.geometry.location.lng
                        activities.address = result.result.formatted_address
                        activities.dayTime = daytime
                        activities.place = spaceType 
                        activities.description = ''
                        activities.city = city
                        activities.country = country
                        activities.price = ''
                        activities.tags = tag
                        activities.sousCategorie = subCategory
                        activities.googleId = place.place_id


                        await activities.save()


                    }
                
                } catch(e){
                    console.log(e)
                } finally {
                    //TODO: Mettre un log service ici pour noter l'activité qui n'est pas passé
                    continue;
                }
            }
        }
    }

}