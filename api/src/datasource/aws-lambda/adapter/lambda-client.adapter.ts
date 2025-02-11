import { LambdaClientPort } from '@/datasource/aws-lambda/port/lambda.port';
import {
  InvokeCommand,
  InvokeCommandOutput,
  LambdaClient,
} from '@aws-sdk/client-lambda';
import { env } from 'process';
import { Logger } from '@nestjs/common';

export class LambdaClientAdapter implements LambdaClientPort {
  private readonly logger = new Logger(LambdaClientAdapter.name);

  constructor() {}

  async invokeAuthLambda(payload: string): Promise<InvokeCommandOutput> {
    return this.invokeLambda(env.AWS_AUTH_LAMBDA_FUNC_NAME, payload);
  }

  async invokeVideoLambda(payload: string): Promise<InvokeCommandOutput> {
    return this.invokeLambda(env.AWS_VIDEO_LAMBDA_FUNC_NAME, payload);
  }

  private async invokeLambda(
    functionName: string,
    payload: string,
  ): Promise<InvokeCommandOutput> {
    const client = await this.getLambdaClient();
    try {
      const command = new InvokeCommand({
        FunctionName: functionName,
        Payload: JSON.stringify(payload),
      });

      return await client.send(command);
    } catch (error) {
      this.logger.error(`Error invoking Lambda ${functionName}`, error.stack);
      throw error;
    }
  }

  async getLambdaClient(): Promise<LambdaClient> {
    try {
      return new LambdaClient({
        region: env.AWS_REGION,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
      });
    } catch (error) {
      this.logger.error('Error creating Lambda client', error.stack);
      throw error;
    }
  }
}
