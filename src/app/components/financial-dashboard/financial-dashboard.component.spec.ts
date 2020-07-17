import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialDashboardComponent } from './financial-dashboard.component';

describe('FinancialDashboardComponent', () => {
  let component: FinancialDashboardComponent;
  let fixture: ComponentFixture<FinancialDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
