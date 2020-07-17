import { Pipe, Injectable, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

const _NUMBER_FORMAT_REGEXP = /^(\d+)?\.((\d+)(-(\d+))?)?$/;
const _currencyPipe = (new CurrencyPipe('en-US'));

@Pipe({ name: 'customCurrency', pure: true })
@Injectable({ providedIn: 'root' })
export class CustomCurrencyPipe implements PipeTransform {
    constructor() { }
    transform(value: any, currencyCode: string, symbolDisplay: boolean, digits: string): string {
        if (typeof value === 'number' || _NUMBER_FORMAT_REGEXP.test(value)) {
            return _currencyPipe.transform(value, currencyCode, symbolDisplay, digits);
        } else {
            return value;
        }
    }
}