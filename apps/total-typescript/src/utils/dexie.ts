import Dexie, {Table} from 'dexie'

export interface ProgressEvent {
  id?: number
  eventName: string
  lesson: string
  module: string
  createdOn: Date
}
export interface BookmarkEvent {
  id?: number
  eventName: string
  module: string
  section: string
  resource?: string
  createdOn: Date
}

export class MySubClassedDexie extends Dexie {
  progress!: Table<ProgressEvent>
  bookmarks!: Table<BookmarkEvent>

  constructor() {
    super('total-typescript')
    this.version(1).stores({
      progress: '++id, eventName, lesson, module',
      bookmarks: '++id, eventName, module, section, resource, createdOn',
    })
  }
}

export const localProgressDb = new MySubClassedDexie()
