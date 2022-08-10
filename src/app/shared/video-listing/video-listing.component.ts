import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {AppService} from '../../app.service';
import { Results} from '../../app.models';
import {Settings, AppSettings} from 'src/app/app.settings';
import {VideoPreviewComponent} from './video-preview/video-preview.component';

@Component({
    selector: 'app-video-listing',
    templateUrl: './video-listing.component.html',
    styleUrls: ['./video-listing.component.scss']
})
export class VideoListingComponent implements OnInit {
    @Input('results') results: Array<Results> = [];
    public settings: Settings;
    public isHovering: string = '0';

    constructor(public appSettings: AppSettings, public appService: AppService, public dialog: MatDialog, private router: Router) {
        this.settings = this.appSettings.settings;
    }

    ngOnInit() {

    }

    hover(index) {
        console.log(this.results[index].id);
        this.isHovering = this.results[index].id + '';
        this.results[index].isHover = true;
    }

    public openDialog(video) {
        let dialogRef = this.dialog.open(VideoPreviewComponent, {
            data: video,
            panelClass: 'video-dialog',
            direction: (this.settings.rtl) ? 'rtl' : 'ltr'
        });
        dialogRef.afterClosed().subscribe(video => {
            if (video) {
                this.router.navigate(['/video-detail', video.collection, video.id,  video.caption]
                    , { queryParams: { category: video.category }});
            }
        });
    }

}
