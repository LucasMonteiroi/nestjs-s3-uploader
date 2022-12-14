import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import fastify from 'fastify';
import http from 'http';
import { AppService } from './app.service';

@Controller('v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  async uploadS3(
    @Req() req,
    @Res() res: fastify.FastifyReply<http.ServerResponse>,
  ): Promise<fastify.FastifyReply<http.ServerResponse>> {
    try {
      const dataUpload = await this.appService.fileUploadS3(
        req.body.file,
        req.body.folder ? req.body.folder : null,
      );
      return res.status(HttpStatus.OK).send(dataUpload);
    } catch (err) {
      return res.status(HttpStatus.NOT_FOUND).send(err);
    }
  }
}
