import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OsceComponent } from './osce.component';

describe('OsceComponent', () => {
  let component: OsceComponent;
  let fixture: ComponentFixture<OsceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OsceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OsceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
