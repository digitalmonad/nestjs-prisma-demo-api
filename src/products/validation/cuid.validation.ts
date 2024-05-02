import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import * as cuid from 'cuid';

@Injectable()
export class ValidateCuidPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!cuid.isCuid(value)) {
      throw new BadRequestException('Invalid ID format');
    }
    return value;
  }
}
