import { Injectable } from "@nestjs/common"
import moment from 'moment';

@Injectable()
export class DateHelper {
    async formatDateEmail(date: moment.MomentInput) {
        const parsedDate = moment(date, "YYYY-MM-DD HH:mm:ss.SSS");
        return parsedDate.format("D MMMM YYYY");
    }
}