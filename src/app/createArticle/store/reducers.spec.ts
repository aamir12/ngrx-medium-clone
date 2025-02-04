import { ArticleRequestInterface } from "src/app/shared/types/articleRequest.interface";
import { CreateArticleStateInterface } from "../types/createArticleState.interface";
import { createArticleActions } from "./actions";
import * as reducerFile from './reducers';
import { ArticleInterface } from "src/app/shared/types/article.interface";
import { ROUTER_NAVIGATION, RouterNavigationAction, routerNavigationAction } from "@ngrx/router-store";
import { BackendErrorsInterface } from "src/app/shared/types/backendErrors.interface";


describe('Product reducers', () => {
  it('createArticleActions.createArticle', () => {
    
    // arrange
    const request: ArticleRequestInterface = {
      article: {
        title: 'string',
        description: 'string',
        body: 'string',
        tagList:['']
      }
    }
    const action = createArticleActions.createArticle(
      {request}
    );
 
    const expectedState: CreateArticleStateInterface = {
      ...reducerFile.initialState,
      isSubmitting: true
    };
 
    // act
    const result = reducerFile
      .createArticleReducer(reducerFile.initialState, action);
    // assert
    expect(result).toEqual(expectedState);
  });

  it('createArticleActions.createArticleSuccess', () => {
    
    // arrange
    const article: ArticleInterface = {
       body: 'string',
        createdAt: 'string',
        description: 'string',
        favorited: true,
        favoritesCount: 1,
        slug: 'string',
        tagList: [''],
        title: 'string',
        updatedAt: 'string',
        author: {
          username: 'string',
          bio: 'string',
          image: 'string',
          following: true
        }
    }
    const action = createArticleActions.createArticleSuccess(
      {article}
    );
 
    const expectedState: CreateArticleStateInterface = {
      ...reducerFile.initialState,
      isSubmitting: false
    };
 
    // act
    const result = reducerFile
      .createArticleReducer(reducerFile.initialState, action);
    // assert
    expect(result).toEqual(expectedState);
  });
  it('createArticleActions.createArticleFailure', () => {
    
    // arrange
    const errors: BackendErrorsInterface = {
       invalid: ['Invalid user']
    }
    const action = createArticleActions.createArticleFailure(
      {errors}
    );
 
    const expectedState: CreateArticleStateInterface = {
      ...reducerFile.initialState,
      isSubmitting: false,
      validationErrors: errors
    };
 
    // act
    const result = reducerFile
      .createArticleReducer(reducerFile.initialState, action);
    // assert
    expect(result).toEqual(expectedState);
  });

  it('should reset state to initial state', () => {
    const mockRouteState = {
      url:'/home',
    };
    const action:RouterNavigationAction = {
      type: ROUTER_NAVIGATION,
      payload: {
        routerState: mockRouteState as any,
        event: {} as any
      }
    };

    const result = reducerFile
    .createArticleReducer(reducerFile.initialState, action);

    expect(result).toEqual(reducerFile.initialState);
  });

});