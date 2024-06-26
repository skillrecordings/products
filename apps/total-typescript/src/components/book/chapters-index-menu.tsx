import type {Book, BookChapter} from '@/lib/book'
import type {Variants} from 'framer-motion'
import {motion} from 'framer-motion'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import {trpc} from '@/trpc/trpc.client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@skillrecordings/ui'
import Link from 'next/link'
import {ProEssentialsBanner} from './pro-essentials-banner'
import {cn} from '@skillrecordings/ui/utils/cn'
import {DialogClose} from '@skillrecordings/ui/primitives/dialog'
import {XIcon} from '@heroicons/react/outline'

export const ChaptersIndexMenu: React.FC<{
  book: Book
  chapter: BookChapter
  setIsMenuOpen: React.Dispatch<boolean>
  isMenuOpen: boolean
}> = ({book, chapter: currentChapter, setIsMenuOpen, isMenuOpen}) => {
  const container: Variants = {
    hidden: {
      opacity: 0,

      transition: {duration: 0.5},
    },
    show: {
      opacity: 1,

      transition: {staggerChildren: 0.05, type: 'easeInOut'},
    },
  }

  const item: Variants = {
    hidden: {opacity: 0, y: -20},
    show: {opacity: 1, y: 0},
  }

  const {ability, abilityRulesStatus} = useAbilities()
  const canViewTypeScriptProEssentials = ability.can('view', 'Content')

  return (
    <>
      <Dialog
        open={isMenuOpen}
        onOpenChange={(open) => {
          setIsMenuOpen(open)
        }}
      >
        <DialogContent
          withCloseButton={false}
          className="left-0 top-0 h-full w-full max-w-none translate-x-0 translate-y-0"
        >
          <motion.nav
            variants={container}
            initial="hidden"
            animate="show"
            className="fixed left-0 top-0 flex h-screen w-full flex-col items-center justify-start overflow-y-auto bg-gradient-to-b from-background to-gray-800 py-5 text-foreground scrollbar-none sm:py-8"
          >
            <DialogHeader className="mx-auto w-full max-w-4xl border-b border-gray-800 p-5 pb-8 sm:p-10 sm:pb-5">
              <DialogTitle className="flex w-full flex-col items-center justify-between sm:flex-row">
                <motion.span className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
                  <Link href={`/books/${book.slug.current}`}>{book.title}</Link>
                </motion.span>
                {!canViewTypeScriptProEssentials &&
                  abilityRulesStatus === 'success' && (
                    <motion.li
                      variants={item}
                      className="hidden flex-shrink-0 px-5 sm:flex"
                    >
                      <ProEssentialsBanner />
                    </motion.li>
                  )}
              </DialogTitle>
              <p className="sm:text-lefttext-center font-sans text-lg font-normal opacity-75 sm:pt-5">
                Chapters Index
              </p>
            </DialogHeader>
            <motion.ol className="mx-auto flex w-full max-w-4xl flex-col pb-24">
              {book.chapters.map((chapter, i) => {
                const isCurrentChapter = chapter._id === currentChapter._id

                return (
                  <motion.li variants={item} key={chapter._id}>
                    <Link
                      className={cn(
                        'flex items-center gap-5 rounded px-5 py-3 font-text text-xl font-semibold transition duration-150 hover:bg-white/5 sm:gap-10 sm:px-10 sm:py-5 sm:text-3xl sm:italic',
                        {
                          'bg-gray-800 text-primary hover:brightness-110':
                            isCurrentChapter,
                        },
                      )}
                      href={`/books/${book.slug.current}/${chapter.slug}`}
                    >
                      <span className="font-mono text-xs opacity-50">
                        {i + 1}
                      </span>
                      <span>{chapter.title}</span>
                      {isCurrentChapter && (
                        <span className="not-italic" aria-hidden="true">
                          ☜
                        </span>
                      )}
                    </Link>
                  </motion.li>
                )
              })}
              <DialogClose className="fixed right-3 top-3 rounded-full bg-gray-800 p-3 transition ease-in-out hover:bg-gray-700 active:bg-gray-700 sm:right-5">
                <XIcon className="h-5 w-5" />
              </DialogClose>
              {!canViewTypeScriptProEssentials &&
                abilityRulesStatus === 'success' && (
                  <motion.li variants={item} className="flex px-5 sm:hidden">
                    <ProEssentialsBanner />
                  </motion.li>
                )}
            </motion.ol>
          </motion.nav>
        </DialogContent>
      </Dialog>
    </>
  )
}

const useAbilities = () => {
  const {data: abilityRules, status: abilityRulesStatus} =
    trpc.modules.rules.useQuery({
      moduleSlug: 'typescript-pro-essentials',
      moduleType: 'workshop',
    })
  return {ability: createAppAbility(abilityRules || []), abilityRulesStatus}
}
