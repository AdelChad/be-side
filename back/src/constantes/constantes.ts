import { DayTime } from "src/enum/detailActivity";

require('dotenv').config();
const crypto = require('crypto');

export const jwtConstants = {
    secret:  crypto.randomBytes(Math.ceil(15/2)).toString('hex').slice(0, 15)
}

export const dayTimeMapping = {
    [DayTime.MORNING]: 'morningActivity',
    [DayTime.NOONDAY]: 'noondayActivity',
    [DayTime.AFTERNOON]: 'afternoonActivity',
    [DayTime.EVENING]: 'eveningActivity',
    [DayTime.NIGHT]: 'nightActivity',
};