import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeofdayModelComponent } from './timeofday-model.component';

describe('TimeofdayModelComponent', () => {
  let component: TimeofdayModelComponent;
  let fixture: ComponentFixture<TimeofdayModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeofdayModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeofdayModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
