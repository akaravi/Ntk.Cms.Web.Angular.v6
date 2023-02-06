import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cmsthumbnail' })
export class CmsImageThumbnailPipe implements PipeTransform {
  transform(value): any {
    value = value + '';
    return value.replace('/images/', '/thumbnails/');
  }
}
