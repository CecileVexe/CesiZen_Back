// src/filters/multer-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { MulterError } from 'multer';
import { Response } from 'express';

@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = 'Erreur lors du téléchargement du fichier.';

    switch (exception.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'Le fichier est trop volumineux (max 1 Mo).';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message =
          'Fichier inattendu. Seuls les fichiers images sont autorisés.';
        break;
    }

    response.status(400).json({
      statusCode: 400,
      message,
      error: 'Bad Request',
    });
  }
}
