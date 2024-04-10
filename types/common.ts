import { CalloutType } from '@uniformdev/design-system';

export enum ParameterTypes {
  Image = 'cloudinary-image',
  ImageList = 'cloudinary-image-list',
  Video = 'cloudinary-video',
  MediaSelector = 'cloudinary-media-selector',
}

export interface ClientError {
  type: CalloutType;
  title?: string;
  text: string;
}
