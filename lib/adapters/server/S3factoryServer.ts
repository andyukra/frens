import { S3adapter } from './S3adapter';
import cloudinaryServerAdapter from './cloudinaryServerAdapter';

export default function(type: string): S3adapter {
	switch(type) {
		case 'cloudinary':
			return cloudinaryServerAdapter();
		default:
			throw new Error("Adaptador incorrecto");
	}
}