import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  constructor() {
    AWS.config.update({
      region: 'us-west-2'
    });
  }

  // See https://github.com/awslabs/aws-cognito-angular-quickstart

  // kousekt/angularcognitotest: Angular test app for cognito
}
