import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterByIdPipe } from './filter-by-id.pipe';
import { FilterBySizePipe } from './filter-by-size.pipe';
import { FilterBrandsPipe } from './filter-brands.pipe';
import { RelateProductPipe } from './related-product.pipe';
import { BrandSearchPipe } from './brand-search.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        FilterByIdPipe,
        FilterBySizePipe,
        FilterBrandsPipe,
        BrandSearchPipe,
        RelateProductPipe
    ],
    exports: [
        FilterByIdPipe,
        FilterBySizePipe,
        FilterBrandsPipe,
        BrandSearchPipe,
        RelateProductPipe
    ]
})
export class PipesModule { }
