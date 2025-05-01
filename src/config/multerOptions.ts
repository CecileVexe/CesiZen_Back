import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const multerImageOptions: MulterOptions = {
  limits: {
    fileSize: 1 * 1024 * 1024, // 1 Mo
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/^image\/(jpeg|png|jpg)$/)) {
      const error: any = new Error(
        'Seuls les fichiers JPEG ou PNG sont autorisés',
      );
      error.code = 'LIMIT_UNEXPECTED_FILE';
      return cb(error, false);
    }
    cb(null, true);
  },
};
