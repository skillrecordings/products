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
    super('total-typescript')
    this.version(1).stores({
      progress: '++id, eventName, lesson, module',
    })
  }
}

export const localProgressDb = new MySubClassedDexie()

export interface BookmarkEvent {
  id?: number
  eventName: string
  module: string
  section: string
  resource?: string
  createdOn: Date
}

export class MySubClassedBookDexie extends Dexie {
  bookmarks!: Table<BookmarkEvent>

  constructor() {
    super('total-typescript-books')
    this.version(1).stores({
      bookmarks: '++id, eventName, module, section, resource, createdOn',
    })
  }
}

export const localBookDb = new MySubClassedBookDexie()
