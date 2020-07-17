import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupEquipmentCostComponent } from './setup-equipment-cost.component';

describe('SetupEquipmentCostComponent', () => {
  let component: SetupEquipmentCostComponent;
  let fixture: ComponentFixture<SetupEquipmentCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupEquipmentCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupEquipmentCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
