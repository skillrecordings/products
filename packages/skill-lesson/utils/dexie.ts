import Dexie, {type Table} from 'dexie'

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
    super(process.env.NEXT_PUBLIC_APP_NAME as string)
    this.version(1).stores({
      progress: '++id, eventName, lesson, module',
    })
  }
}

export const localProgressDb = new MySubClassedDexie()
