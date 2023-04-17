import Dexie, {Table} from 'dexie'

export interface ProgressEvent {
  id?: number
  eventName: string
  lesson: string
  module: string
  createdOn: Date
}

export class MySubClassedDexie extends Dexie {
  progress!: Table<ProgressEvent>

  constructor() {
    super('scriptkit')
    this.version(1).stores({
      progress: '++id, eventName, lesson, module',
    })
  }
}

export const localProgressDb = new MySubClassedDexie()
