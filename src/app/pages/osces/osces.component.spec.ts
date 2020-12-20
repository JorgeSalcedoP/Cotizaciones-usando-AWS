import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OscesComponent } from './osces.component';

describe('OscesComponent', () => {
  let component: OscesComponent;
  let fixture: ComponentFixture<OscesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OscesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OscesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
