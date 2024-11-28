import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient()

export const User = prisma.user
export const Admin = prisma.admin
export const Course = prisma.course
export const Purchase = prisma.purchase
export const Transaction = prisma.transaction
export const Balance = prisma.balance

export async function connectDb(){
  try{
    await prisma.$connect()
    console.log('Database connected')
  } catch (error){
    console.log('Error connecting to database:', error)
  }
} 