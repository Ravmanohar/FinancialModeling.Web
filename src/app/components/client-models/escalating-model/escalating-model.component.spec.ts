import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalatingModelComponent } from './escalating-model.component';

describe('EscalatingModelComponent', () => {
  let component: EscalatingModelComponent;
  let fixture: ComponentFixture<EscalatingModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscalatingModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscalatingModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
