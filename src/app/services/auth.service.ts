import { Injectable } from '@angular/core';
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { Observable } from 'rxjs/index';

// https://docs.aws.amazon.com/cognito/latest/developerguide/using-amazon-cognito-user-identity-pools-javascript-examples.html

const poolData = {
  UserPoolId: 'us-west-2_CPEOlgCr7', // Your user pool id here
  ClientId: '38qdjeagcn93uqgbnh18qoj4dg' // Your client id here
};

const userPool = new CognitoUserPool(poolData);

@Injectable()
export class AuthService {
  cognitoUser: any;

  get username() {
    return this.cognitoUser ? this.cognitoUser.getUsername() : '';
  }

  constructor() {
    this.cognitoUser = userPool.getCurrentUser();
    this.updateSession();
  }

  // https://github.com/kousekt/angularcognitotest/blob/master/src/app/shared/authorization.service.ts

  logIn(username: string, password: string) {
    const authenticationData = {
      Username : username,
      Password : password,
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userData = {
      Username : username,
      Pool : userPool
    };
    this.cognitoUser = new CognitoUser(userData);

    return Observable.create(observer => {

      // https://docs.aws.amazon.com/cognito/latest/developerguide/using-amazon-cognito-identity-user-pools-javascri
      //  pt-example-authenticating-admin-created-user.html
      this.cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          this.updateSession();
          observer.next(result);
          observer.complete();
        },
        onFailure: (err) => {
          console.log('Error:', err);
          observer.error(err);
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          this.cognitoUser.completeNewPasswordChallenge(password, undefined, this);
        },
      });
    });
  }

  isLoggedIn() {
    return userPool.getCurrentUser() != null;
  }

  logOut() {
    userPool.getCurrentUser().signOut();
    this.cognitoUser = null;
  }

  getToken() {
    if (!this.cognitoUser || !this.cognitoUser.signInUserSession) {
      return '';
    }
    return this.cognitoUser.signInUserSession.idToken.jwtToken;
  }

  // Needed to populate `cognitoUser.signInUserSession`
  private updateSession() {
    if (this.cognitoUser != null) {
      this.cognitoUser.getSession((err, session) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }
  }
}
