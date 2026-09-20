import type { FastifyRequest, FastifyReply } from "fastify";
import "@fastify/jwt";

export async function checkAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({ message: "Não autenticado." });
  }
}
