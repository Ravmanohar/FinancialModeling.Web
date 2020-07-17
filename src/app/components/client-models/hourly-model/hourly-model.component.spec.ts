import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyModelComponent } from './hourly-model.component';

describe('HourlyModelComponent', () => {
  let component: HourlyModelComponent;
  let fixture: ComponentFixture<HourlyModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HourlyModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HourlyModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
