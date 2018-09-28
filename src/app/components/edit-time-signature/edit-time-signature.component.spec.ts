import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTimeSignatureComponent } from './edit-time-signature.component';

describe('EditTimeSignatureComponent', () => {
  let component: EditTimeSignatureComponent;
  let fixture: ComponentFixture<EditTimeSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTimeSignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTimeSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
