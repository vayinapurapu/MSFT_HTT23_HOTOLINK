import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Web } from "@pnp/sp/webs";
import * as moment from 'moment';

const web = Web("https://devstories.sharepoint.com/teams/PMS");
class SharePointService {

    public async createListItem(listName: string, item: any) {
        return await web.lists.getByTitle(listName).items.add(item);
    }

    public async getFilteredItems(listName: string, bookingDate: any) {
        const startDate = moment(bookingDate).format('YYYY-MM-DDT00:00:00.00Z');
        const endDate = new Date(new Date().setDate(new Date(bookingDate).getDate() + 1));
        const startDateString = startDate;
        const endDateString = endDate.toISOString();

        return await web.lists.getByTitle(listName).items
            .filter(`BookingDate ge '${startDateString}' and BookingDate lt '${endDateString}'`)
            .get();
    }

    public async getItems(listName: string) {
        return await web.lists.getByTitle(listName).items
            .select("*,Author/Title").expand("Author").top(4999).get();
    }

    public async checkUserisAdmin(userEmail: string) {
        const items: any = await web.lists.getByTitle("Admins").items.filter(`Title eq '${userEmail}'`).top(1).get();
        return items.length > 0 ? true : false;
    }

}

export default SharePointService;