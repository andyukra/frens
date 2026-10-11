import { DbAdapter } from './dbAdapter';
import MongoAdapter from './mongoAdapter';

export default function(type: string): DbAdapter {
	switch(type) {
		case 'mongo':
			return MongoAdapter();
		default:
			throw new Error("Adaptador inválido");
	}
}