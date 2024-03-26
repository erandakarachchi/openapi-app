import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';

export class OpenapiAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Code to generate the lambda function
    const openApiSampleLambda = new cdk.aws_lambda.Function(this, 'OpenApiSampleLambda', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code:  cdk.aws_lambda.Code.fromAsset(path.join(__dirname, '../resources/lambda')),
    });

    // Code to generate the api gateway
    new cdk.aws_apigateway.SpecRestApi(this,"OpenApiRest",{
      apiDefinition: cdk.aws_apigateway.ApiDefinition.fromAsset("open-api-spec.yml"),
      restApiName: "OpenApiRest",
      deployOptions: {
        stageName: "dev"
      },
      deploy: true
    });
  }
}
