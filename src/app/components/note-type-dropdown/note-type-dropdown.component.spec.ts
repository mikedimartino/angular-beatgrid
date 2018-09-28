import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteTypeDropdownComponent } from './note-type-dropdown.component';

describe('NoteTypeDropdownComponent', () => {
  let component: NoteTypeDropdownComponent;
  let fixture: ComponentFixture<NoteTypeDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteTypeDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteTypeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
