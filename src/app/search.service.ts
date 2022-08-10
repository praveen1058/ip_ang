import {Injectable, ViewChild} from '@angular/core';
import {Filter, VideoFilter} from './app.models';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class SearchService {
    category = new BehaviorSubject(1);
    search = new BehaviorSubject('');
    filter = {license: '', orientation: '', imageType: '', people: '', gender: '', age: '', ethnicity: '', sort: '', coll_id: '', advsearchtxt:''};
    videoFilter = {
        durationFrom: '0',
        durationTo: '120',
        fpsFrom: '0',
        fpsTo: '60',
        gender: '',
        people: '',
        resolution: '',
        sort: '',
        priceFrom: '0',
        priceTo: '10000',
        advsearchtxt: ''
    };

    setCategory(categoryText: number) {
        this.category.next(categoryText);
    }

    setSearch(searchText: string) {
        this.search.next(searchText);
    }

    setFilterImage(filter: Filter) {
        this.filter = {
            license: filter.license.toString(), orientation: filter.orientation, imageType: filter.imageType,
            people: filter.people, gender: filter.gender, age: filter.age, ethnicity: filter.ethnicity, sort: filter.sort,
            coll_id: filter.coll_id.toString(),
            advsearchtxt: filter.advsearchtxt.toString()
        };
    }

    setFilterVideo(filter: VideoFilter) {
        this.videoFilter = {
            durationFrom: filter.durationFrom,
            durationTo: filter.durationTo,
            fpsFrom: filter.fpsFrom,
            fpsTo: filter.fpsTo,
            gender: filter.gender,
            people: filter.people,
            resolution: filter.resolution.toString(),
            sort: filter.sort,
            priceFrom: filter.priceFrom,
            priceTo: filter.priceTo,
            advsearchtxt: filter.advsearchtxt.toString()
        };
    }


}
