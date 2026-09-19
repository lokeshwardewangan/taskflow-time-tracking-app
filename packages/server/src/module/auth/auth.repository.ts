import { prisma } from '../../../prisma/config';

export class AuthRepository {
   static async findUserByEmail(email: string) {
      return prisma.user.findUnique({
         where: { email },
      });
   }

   static async createUser(email: string, passwordHash: string) {
      return prisma.user.create({
         data: {
            email,
            passwordHash,
         },
         select: {
            id: true,
            email: true,
            createdAt: true,
         },
      });
   }
}
