import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { Actions } from '@ngrx/effects';
import { createArticleEffect, redirectAfterCreateEffect } from './effects';
import { CreateArticleService } from '../services/createArticle.service';
import { createArticleActions } from './actions';

import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ArticleRequestInterface } from 'src/app/shared/types/articleRequest.interface';
import { ArticleInterface } from 'src/app/shared/types/article.interface';
import { TestScheduler } from 'rxjs/testing';

describe('CreateArticleEffects', () => {
  let actions$: Observable<any>;
  let effects: ReturnType<typeof createArticleEffect>;
  let redirectEffects: ReturnType<typeof redirectAfterCreateEffect>;
  let createArticleService: jasmine.SpyObj<CreateArticleService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const createArticleServiceSpy = jasmine.createSpyObj('CreateArticleService', ['createArticle']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        {
          provide: CreateArticleService,
          useValue: createArticleServiceSpy,
        },
        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
    });

    effects = TestBed.runInInjectionContext(() => createArticleEffect());
    redirectEffects = TestBed.runInInjectionContext(() => redirectAfterCreateEffect());
    createArticleService = TestBed.inject(CreateArticleService) as jasmine.SpyObj<CreateArticleService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should dispatch createArticleSuccess action on successful article creation', () => {
    const request: ArticleRequestInterface = {
      article: {
        title: 'Test Title',
        description: 'Test Description',
        body: 'Test Body',
        tagList: ['tag1', 'tag2'],
      },
    };

    const article: ArticleInterface = {
      body: 'Test Body',
      createdAt: '2023-01-01',
      description: 'Test Description',
      favorited: false,
      favoritesCount: 0,
      slug: 'test-title',
      tagList: ['tag1', 'tag2'],
      title: 'Test Title',
      updatedAt: '2023-01-01',
      author: {
        username: 'testuser',
        bio: null,
        image: 'test-image-url',
        following: false,
      },
    };

    actions$ = hot('-a-|', { a: createArticleActions.createArticle({ request }) });
    createArticleService.createArticle.and.returnValue(of(article));

    const expected = cold('-b-|', {
      b: createArticleActions.createArticleSuccess({ article }),
    });

    expect(effects).toBeObservable(expected);
  });

  it('should dispatch createArticleFailure action on failed article creation', () => {
    const request: ArticleRequestInterface = {
      article: {
        title: 'Test Title',
        description: 'Test Description',
        body: 'Test Body',
        tagList: ['tag1', 'tag2'],
      },
    };

    const errorResponse = new HttpErrorResponse({
      error: { errors: { title: ['Title is required'] } },
      status: 400,
      statusText: 'Bad Request',
    });

    actions$ = hot('-a-|', { a: createArticleActions.createArticle({ request }) });
    createArticleService.createArticle.and.returnValue(throwError(() => errorResponse));

    const expected = cold('-b-|', {
      b: createArticleActions.createArticleFailure({
        errors: errorResponse.error.errors,
      }),
    });

    expect(effects).toBeObservable(expected);
  });

  // it('should navigate to the article page after successful article creation', () => {
  //   const article: ArticleInterface = {
  //     body: 'Test Body',
  //     createdAt: '2023-01-01',
  //     description: 'Test Description',
  //     favorited: false,
  //     favoritesCount: 0,
  //     slug: 'test-title',
  //     tagList: ['tag1', 'tag2'],
  //     title: 'Test Title',
  //     updatedAt: '2023-01-01',
  //     author: {
  //       username: 'testuser',
  //       bio: null,
  //       image: 'test-image-url',
  //       following: false,
  //     },
  //   };

  //   actions$ = hot('-a-|', { a: createArticleActions.createArticleSuccess({ article }) });
  //   redirectEffects.subscribe();

  //   expect(router.navigate).toHaveBeenCalledWith(['/articles', article.slug]);
  // });
});


describe('redirectAfterCreateEffect', () => {
  let actions$: Observable<any>;
  let effects: ReturnType<typeof redirectAfterCreateEffect>;
  let router: jasmine.SpyObj<Router>;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
    });

    effects = TestBed.runInInjectionContext(() => redirectAfterCreateEffect());
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Initialize TestScheduler
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should navigate to the article page after successful article creation', () => {
    const article: ArticleInterface = {
      body: 'Test Body',
      createdAt: '2023-01-01',
      description: 'Test Description',
      favorited: false,
      favoritesCount: 0,
      slug: 'test-title',
      tagList: ['tag1', 'tag2'],
      title: 'Test Title',
      updatedAt: '2023-01-01',
      author: {
        username: 'testuser',
        bio: null,
        image: 'test-image-url',
        following: false,
      },
    };

    // Simulate the action stream
    testScheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a-|', { a: createArticleActions.createArticleSuccess({ article }) });

      // Subscribe to the effect
      effects.subscribe();

      // Flush the scheduler to execute the observable
      testScheduler.flush();

      // Verify navigation
      expect(router.navigate).toHaveBeenCalledWith(['/articles', article.slug]);
    });
  });
});

