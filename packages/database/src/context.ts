import {mockDeep, DeepMockProxy} from 'jest-mock-extended'
import {prisma} from './client'
import {PrismaClient} from '@prisma/client'

export const defaultContext: Context = {prisma}

export type Context = {
  prisma: PrismaClient
}

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>
}

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
  }
}
