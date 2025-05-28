import { BadRequestException } from "@nestjs/common";
import { createWriteStream, mkdirSync, unlink } from 'fs';
import { Readable } from 'stream';
import * as path from 'path';
import { extname } from 'path';
import * as moment from 'moment';

export enum TokenType {
  FULL = 'FULL',
  BRANCH = 'BRANCH',
  OTP = 'OTP',
}

export enum FolderBucketType {
  FISH = 'FISH',
  USER_PROFILE = 'USER_PROFILE',
  PRACTICE = 'PRACTICE',
}
export const _validateFile = (
  name: string,
  file: Express.Multer.File,
  type: string[],
  size: number,
) => {
  // check if file is exist
  if (!file) throw new BadRequestException(`Upload file ${name} anda`);

  // get property from file
  let ext = path.extname(file.originalname);
  let fileSize = 1024 * 1024 * size;

  // check ext file allow
  if (!type.includes(ext))
    throw new BadRequestException('Jenis file tidak didukung');

  // check if file size is allow
  if (file.size > fileSize)
    throw new BadRequestException('Ukuran file melebihi batas yang ditentukan');

  return;
};

export const getFilename = (file?: Express.Multer.File) => {
  let fileName: string;
  if (file) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    fileName = `${uniqueSuffix}${ext}`;
  }
  return fileName;
};

export const getCustomFilename = (name: string, file?: Express.Multer.File) => {
  let fileName: string;
  if (file) {
    const ext = extname(file.originalname);
    fileName = `${name}${ext}`;
  }
  return fileName;
};

export const createFileImageHelper = async (imageFile, writePath, fileName) => {
  // create directory if not exists
  mkdirSync(writePath, { recursive: true });

  // write stream and waiting process
  const is = Readable.from(imageFile.buffer);
  const os = createWriteStream(`${writePath}/${fileName}`);
  is.pipe(os);

  return 'success';
};


export const deleteFileImageHelper = async (deletePath, fileName) => {
  try {
    await new Promise((resolve, reject) => {
      unlink(`${deletePath}/${fileName}`, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve('success');
        }
      });
    });
    return 'success';
  } catch (error) {
    return
  }
};

export const checkDateRange = (startDate: Date, endDate: Date, range: number) => {
  // count days between two dates
  const start = moment(startDate);
  const end = moment(endDate);
  const countDays = end.diff(start, 'days');
  if (countDays > range) throw new BadRequestException(`Filter tanggal tidak boleh melebihi ${range} hari`)
  return true
}

// 2024-01-01T00:00:00+08:00 --> true
export const isValidDateStringUsingTzTime = (date: string): boolean => {
  const splittedPlus = date.split('T')[1].split('+');
  const splittedMins = date.split('T')[1].split('-');

  return splittedPlus.length === 2 || splittedMins.length === 2;
};

export const generateSlug = (input: string) => {
  // Remove symbols using regular expression
  const cleanedInput = input.replace(/[^\w\s-]/g, '');

  // Replace spaces with dashes, excluding the last space
  const slug = cleanedInput.replace(/\s+(?=\S)(?!$)/g, '-').toLowerCase();

  return slug;
};

export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}



const backgroundColors = [
  'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-purple-500',
  'bg-pink-500', 'bg-teal-500', 'bg-orange-500', 'bg-indigo-500', 'bg-gray-500'
];

const backgroundImages = [
  'bg-curtain', 'bg-circles', 'bg-autumn', 'bg-connections', 'bg-parkay-floor',
  'bg-i-like-food', 'bg-groovy', 'bg-signal', 'bg-bathroom-floor', 'bg-bamboo',
  'bg-jigsaw', 'bg-leaf'
];

export function generateBackgroundClass() {
  const randomColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
  const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
  return { backgroundColor: randomColor, backgroundImage: randomImage };
}