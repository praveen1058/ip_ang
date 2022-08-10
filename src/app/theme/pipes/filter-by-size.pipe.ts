import {Pipe, PipeTransform} from '@angular/core';
import {Plan} from '../../app.models';

@Pipe({
    name: 'filterBySize',
    pure: false
})
export class FilterBySizePipe implements PipeTransform {
    transform(items: Plan[], filter: any): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        // console.log(items);
        return items.filter(item => (item.name == filter.name && item.days_validity == filter.days));
    }
}
