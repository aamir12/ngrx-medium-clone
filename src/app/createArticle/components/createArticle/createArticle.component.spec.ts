import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CreateArticleComponent } from './createArticle.component';
import { ArticleFormComponent } from 'src/app/shared/components/articleForm/articleForm.component';
import { createArticleActions } from '../../store/actions';
import { selectIsSubmitting, selectValidationErrors } from '../../store/reducers';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('CreateArticleComponent', () => {
  let component: CreateArticleComponent;
  let fixture: ComponentFixture<CreateArticleComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        StoreModule.forRoot({}),
        CreateArticleComponent, // Import standalone component
        ArticleFormComponent, // Import standalone component
      ],
      providers: [
        provideMockStore({
          initialState: {
            createArticle: {
              isSubmitting: false,
              validationErrors: null,
            },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateArticleComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as MockStore;
    dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should initialize with correct initial values', () => {
    expect(component.initialValues).toEqual({
      title: '',
      description: '',
      body: '',
      tagList: [],
    });
  });

  it('should correctly reflect isSubmitting and backendErrors from the store', () => {
    const expectedData = {
      isSubmitting: false,
      backendErrors: null,
    };

    component.data$.subscribe((data) => {
      expect(data).toEqual(expectedData);
    });
  });

  it('should dispatch createArticle action on form submission', () => {
    const articleFormValues = {
      title: 'Test Title',
      description: 'Test Description',
      body: 'Test Body',
      tagList: ['tag1', 'tag2'],
    };

    const expectedRequest = {
      article: articleFormValues,
    };

    component.onSubmit(articleFormValues);

    expect(dispatchSpy).toHaveBeenCalledWith(
      createArticleActions.createArticle({ request: expectedRequest })
    );
  });

  // it('should bind isSubmitting and backendErrors to the template', () => {
  //   const isSubmitting = true;
  //   const backendErrors = { title: ['Title is required'] };

  //   store.overrideSelector(selectIsSubmitting, isSubmitting);
  //   store.overrideSelector(selectValidationErrors, backendErrors);
  //   store.refreshState();
  //   fixture.detectChanges();

  //   const submittingElement = fixture.debugElement.query(By.css('[data-testid="submitting"]'));
  //   const errorsElement = fixture.debugElement.query(By.css('[data-testid="errors"]'));

  //   expect(submittingElement.nativeElement.textContent).toContain('Submitting...');
  //   expect(errorsElement.nativeElement.textContent).toContain('Title is required');
  // });

  it('should call onSubmit when the form is submitted', () => {
    spyOn(component, 'onSubmit');

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);

    expect(component.onSubmit).toHaveBeenCalled();
  });
});