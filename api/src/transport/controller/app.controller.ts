import { Controller, Get, Param, Post } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get(':userId/process')
  getListByUser(@Param('userId') userId: string) {
    return {
      //TODO
    };
  }

  @Post('/process')
  process() {
    return {
      //TODO
    };
  }
}
