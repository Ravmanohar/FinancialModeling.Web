import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupModelTabComponent } from './setup-model-tab.component';

describe('SetupModelTabComponent', () => {
  let component: SetupModelTabComponent;
  let fixture: ComponentFixture<SetupModelTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupModelTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupModelTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
