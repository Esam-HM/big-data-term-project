import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDirsComponent } from './create-dirs.component';

describe('CreateDirsComponent', () => {
  let component: CreateDirsComponent;
  let fixture: ComponentFixture<CreateDirsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDirsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDirsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
