import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { GoogleApiService } from "./google-api.service";
import { GooglePlaceSearchDto } from "./dto/add-activities.dto";
import { Roles } from "src/decorators/role.decorator";
import { AuthGuard } from "src/guard/auth.guard";

@Controller('google-api')
export class GoogleApiController {
    constructor(private googleApiService: GoogleApiService) { }

    @UseGuards(AuthGuard)
    @Roles(['admin'])
    @Post()
    createActivities(@Body() googlePlaceSearchDto: GooglePlaceSearchDto) {
        return this.googleApiService.createActivitiesBygoogle(googlePlaceSearchDto)
    }

    @UseGuards(AuthGuard)
    @Roles(['admin'])
    @Get()
    test() {
        this.googleApiService.insertCategs()
    }
}