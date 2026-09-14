"use server";

import { db } from "@/lib/db";
import Pubs from "@/lib/models/pubs";
import { auth } from "@/auth";

export async function like(id) {
  // 1. Verificar autenticación directamente en el servidor por seguridad
  const session = await auth();
  if (!session || !session.user) {
    return { status: "UNAUTHORIZED" };
  }

  const userId = session.user.id; // O el identificador único del usuario

  await db();

  // 2. Operación atómica con $addToSet (agrega solo si no existe en el array)
  const updatedPub = await Pubs.findOneAndUpdate(
    { _id: id, "likes.author": { $ne: userId } }, // Condición: que el id coincida Y el usuario NO esté en la lista
    { $push: { likes: { author: userId } } },
    { new: true }
  );

  // Si no actualizó nada, significa que el usuario ya había dado like
  if (!updatedPub) {
    return { status: "EXISTS" };
  }

  return { status: "OK" };
}