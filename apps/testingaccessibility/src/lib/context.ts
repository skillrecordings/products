import {mockDeep, DeepMockProxy} from 'jest-mock-extended'
import prisma from '../db'
import {PrismaClient} from '../../generated/prisma/client'

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
