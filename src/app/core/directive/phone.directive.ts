import { Directive, HostListener } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[phone]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: PhoneDirective, multi: true }
    ]
})
export class PhoneDirective implements Validator {
    constructor() { }

    validate(c: AbstractControl): { [key: string]: any } {
        if (c.value && !/^-?[1-9]?\d[,]-?[1-9]?\d$/gm.test(c.value)) {
            return {
                phone: 'Invalid phone number'
            };
        }
        return null;
    }
}