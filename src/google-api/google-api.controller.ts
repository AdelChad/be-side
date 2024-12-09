import { Body, Controller, Post } from "@nestjs/common";
import { GoogleApiService } from "./google-api.service";
import { GooglePlaceSearchDto } from "./dto/add-activities.dto";

@Controller('google-api')
export class GoogleApiController {
    constructor(private googleApiService: GoogleApiService) { }


    @Post()
    createActivities(@Body() googlePlaceSearchDto: GooglePlaceSearchDto) {
        return this.googleApiService.createActivitiesBygoogle(googlePlaceSearchDto)
    }
}