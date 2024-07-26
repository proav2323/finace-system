import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddaccountDataComponent } from './addaccount-data.component';

describe('AddaccountDataComponent', () => {
  let component: AddaccountDataComponent;
  let fixture: ComponentFixture<AddaccountDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddaccountDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddaccountDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
