import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesOpsComponent } from './files-ops.component';

describe('FilesOpsComponent', () => {
  let component: FilesOpsComponent;
  let fixture: ComponentFixture<FilesOpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilesOpsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilesOpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
