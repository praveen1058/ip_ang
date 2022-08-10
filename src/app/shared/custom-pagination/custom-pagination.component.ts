import {Component, Input, OnChanges, ViewChild, ViewEncapsulation} from '@angular/core';
import {PaginationInstance} from 'ngx-pagination';

@Component({
    selector: 'custom-pagination',
    templateUrl: 'custom-pagination.component.html',
    styleUrls: ['./custom-pagination.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CustomPaginationComponent implements OnChanges {

    public counter = Array;

    @ViewChild('stepsIndicator', {static: true}) public stepsIndicator;

    @Input('currentStep') currentStep: number;
    @Input('totalItems') totalSteps: number;

    public config: PaginationInstance = {
        id: 'custom-steps-indicator',
        itemsPerPage: 1,
        currentPage: this.currentStep,
        totalItems: this.totalSteps
    };

    constructor() {
    }

    public ngOnChanges() {
        this.stepsIndicator.setCurrent(this.currentStep);
    }
}
