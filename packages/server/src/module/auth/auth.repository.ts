import { prisma } from '../../../prisma/config';

export class AuthRepository {
   static async findUserByEmail(email: string) {
      return prisma.user.findUnique({
         where: { email },
      });
   }

   static async createUser(name: string, email: string, passwordHash: string) {
      return prisma.user.create({
         data: {
            name,
            email,
            passwordHash,
         },
         select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
         },
      });
   }
}
