import { Controller, Get, Logger, Post, Req, Res } from '@nestjs/common';
import axios from 'axios';
import { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller('/*')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Post()
  getHello(@Req() req: Request, @Res() res: Response): any {
    Logger.debug('originalUrl', req.originalUrl);
    const recipientServiceName = req.originalUrl.split(/[\/?]/)[1];
    Logger.debug('recipientServiceName', recipientServiceName);
    const recipientURL = process.env[recipientServiceName];
    Logger.debug('recipientURL', recipientURL);

    if (recipientURL) {
      const axiosConfig = {
        method: req.method,
        url: `${recipientURL}${req.originalUrl}`,
        ...(Object.keys(req.body || {}).length > 0 && { data: req.body }),
      };

      Logger.debug('axiosConfig', axiosConfig);

      axios(axiosConfig)
        .then((response) => {
          res.send(response?.data);
        })
        .catch((err) => {
          Logger.error('axios error', err);

          if (err.response) {
            const { status, data } = err.response;

            res.status(status).json(data);
          } else {
            res.status(500).json({ message: err.message });
          }
        });
    } else {
      res.status(502).json({ error: 'Cannot process request' });
    }
  }
}
