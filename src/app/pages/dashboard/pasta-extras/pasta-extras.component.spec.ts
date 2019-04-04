import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastaExtrasComponent } from './pasta-extras.component';

describe('PastaExtrasComponent', () => {
  let component: PastaExtrasComponent;
  let fixture: ComponentFixture<PastaExtrasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastaExtrasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastaExtrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
