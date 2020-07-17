import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'orderBy', pure: true })
export class OrderByPipe implements PipeTransform {

    transform(list: any[], propertyName: string, isAscendingOrder: boolean = true): any[] {
        if (propertyName) {
            if (isAscendingOrder) {
                list.sort((a: any, b: any) => b[propertyName].localeCompare(a[propertyName]));
                return list.reverse();
            }
            return list.sort((a: any, b: any) => b[propertyName].localeCompare(a[propertyName]));
        }
        else
            return list;
    }
}