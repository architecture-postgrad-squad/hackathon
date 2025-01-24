import { LambdaClientPort } from '@/datasource/aws-lambda/port/auth-lambda.port';
import {
  InvokeCommand,
  InvokeCommandOutput,
  LambdaClient,
} from '@aws-sdk/client-lambda';
import { env } from 'process';

export class LambdaClientAdapter implements LambdaClientPort {
  constructor() {}

  async invokeAuthLambda(payload: string): Promise<InvokeCommandOutput> {
    const client = await this.getLambdaClient();
    try {
      const command = new InvokeCommand({
        FunctionName: env.AWS_AUTH_LAMBDA_FUNC_NAME,
        Payload: JSON.stringify(payload),
      });

      return await client.send(command);
    } catch (error) {
      //TODO: implement logger
      console.log(error);
    }
  }

  async getLambdaClient(): Promise<LambdaClient> {
    try {
      return new LambdaClient({
        region: env.AWS_REGION,
        credentials: {
          accessKeyId: env.AWS_AUTH_LAMBDA_ACCESS_KEY,
          secretAccessKey: env.AWS_AUTH_LAMBDA_SECRET_ACCESS_KEY,
        },
      });
    } catch (error) {
      //TODO: implement logger
      console.log(error);
    }
  }
}
