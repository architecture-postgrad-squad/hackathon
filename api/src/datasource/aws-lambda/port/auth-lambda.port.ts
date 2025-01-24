import { InvokeCommandOutput, LambdaClient } from '@aws-sdk/client-lambda';

export abstract class LambdaClientPort {
  abstract invokeAuthLambda(payload: string): Promise<InvokeCommandOutput>;
  abstract getLambdaClient(): Promise<LambdaClient>;
}
