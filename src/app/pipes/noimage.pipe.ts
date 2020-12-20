import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noimage'
})
export class NoimagePipe implements PipeTransform {

  transform( image: string ): string {

    if ( !image ) {
      return 'assets/img/noimage.jpg';
    }

    if ( image.length > 0 ) {
      return image;
    } else {
      return 'assets/img/noimage.jpg';
    }

  }

}
