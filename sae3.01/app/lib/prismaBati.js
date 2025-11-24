
import { PrismaClient } from '../generated/prisma'; 

const prismaClientSingleton = () => {
  return new PrismaClient();
};

const globalForPrisma = global;
const prismaBati = globalForPrisma.prismaBati ?? prismaClientSingleton();

export default prismaBati;

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prismaBati = prismaBati;
}