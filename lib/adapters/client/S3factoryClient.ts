import { S3adapter } from './S3adapter';
import cloudinaryClientAdapter from './cloudinaryClientAdapter';

export default function(type: string): S3adapter {
	switch(type) {
		case 'cloudinary':
			return cloudinaryClientAdapter();
		default:
			throw new Error("Adaptador incorrecto");
	}
}