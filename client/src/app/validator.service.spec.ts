import { TestBed } from '@angular/core/testing';

import { ValidatorService } from './validator.service';

import {CustomModule} from 'custom.module';
import {By} from "@angular/platform-browser";
import {NgForm} from "@angular/forms";


describe('ValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({providers: [ValidatorService]}));

  it('should use ValidatorService', () => {
    const service: ValidatorService = TestBed.get(ValidatorService);
    expect(service).toBeTruthy();
    //expect(service.getValue()).toBe('real value');
  });

  it('should not allow a name to contain a symbol', () => {
    const service: ValidatorService = TestBed.get(ValidatorService);
    expect(service.createForm()).toBeTruthy();
    //expect(service.getValue()).toBe('real value');
  });

});

//https://angular.io/guide/testing


// it('should not allow a name to contain a symbol'), async(() => {
//   let fixture = TestBed.createComponent(AddRideComponent);
//   let debug = fixture.debugElement;
//   let input = debug.query(By.css('[driver=destination]'));
//
//   fixture.detectChanges();
//   fixture.whenStable().then(() => {
//     input.nativeElement.value = 'bad place';
//     dispatchEvent(input.nativeElement);
//     fixture.detectChanges();
//
//     let form: NgForm = debug.children[0].injector.get(NgForm);
//     let control = form.control.get('destination');
//     expect(control.hasError('notPeeskillet')).toBe(true);
//     expect(form.control.valid).toEqual(false);
//     expect(form.control.hasError('notPeeskillet', ['destination'])).toEqual(true);
//
//     input.nativeElement.value = 'Another Place';
//     dispatchEvent(input.nativeElement);
//     fixture.detectChanges();
//
//     expect(control.hasError('notPeeskillet')).toBe(false);
//     expect(form.control.valid).toEqual(true);
//     expect(form.control.hasError('notPeeskillet', ['destination'])).toEqual(false);
//   });
// });
