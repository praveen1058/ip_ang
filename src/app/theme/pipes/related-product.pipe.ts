import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'relateProductPipe', pure: false })
export class RelateProductPipe implements PipeTransform {
    transform(items:Array<any>, id?) {
        return items.filter(item => item.id !== id);
    }
}