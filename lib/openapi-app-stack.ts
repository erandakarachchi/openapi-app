import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';

// Workaround to import the SpecRestApi
import * as fs from 'fs';

export class OpenapiAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Code to generate the lambda function
    const openApiSampleLambda = new cdk.aws_lambda.Function(this, 'OpenApiSampleLambda', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code:  cdk.aws_lambda.Code.fromAsset(path.join(__dirname, '../resources/lambda/open-api-lambda')),
    });

    let openApiSpec = fs.readFileSync('open-api-spec.json', 'utf8');
    openApiSpec = openApiSpec.replace('${openApiSampleLambdaArn}', openApiSampleLambda.functionArn);


    // Code to generate the api gateway
    new cdk.aws_apigateway.SpecRestApi(this,"OpenApiRest",{
      apiDefinition: cdk.aws_apigateway.ApiDefinition.fromInline(JSON.parse(openApiSpec)),
      restApiName: "OpenApiRest",
      deployOptions: {
        stageName: "dev"
      },
      deploy: true
    });

    openApiSampleLambda.grantInvoke(new cdk.aws_iam.ServicePrincipal('apigateway.amazonaws.com'));

  }
}
