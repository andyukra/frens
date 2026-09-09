import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Por favor define la variable de entorno MONGODB_URI');
}

// Intentar recuperar la conexión guardada en el objeto global de Node.js
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function db() {
  // Si ya existe una conexión activa, la reutiliza
  if (cached.conn) {
    return cached.conn;
  }

  // Si no hay conexión pero ya se inició el proceso, espera a esa misma promesa
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ Conexión establecida con MongoDB');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Si falla, limpia la promesa para permitir reintentos
    throw e;
  }

  return cached.conn;
}