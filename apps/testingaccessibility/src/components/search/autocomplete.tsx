import React from 'react'
import Link from 'next/link'
import {getPathForLesson, getPathForSection} from 'utils/get-resource-paths'
import {
  parseAlgoliaHitHighlight,
  getAlgoliaResults,
} from '@algolia/autocomplete-preset-algolia'
import {searchClient} from 'utils/algolia'
import {highlight} from 'components/search/highlight'
import {useAutocomplete} from 'hooks'
import type {Hit} from '@algolia/client-search'
import {useRouter} from 'next/router'
import {SearchIcon} from '@heroicons/react/solid'
import cx from 'classnames'

const Autocomplete = (props: any) => {
  const inputRef = React.useRef(null)
  const router = useRouter()
  const {autocomplete, state} = useAutocomplete({
    id: 'testing-accessibility-search',
    defaultActiveItemId: 0,
    placeholder: 'Search resources',
    debug: process.env.NODE_ENV === 'development',
    navigator: {
      navigate({itemUrl}) {
        router.push(itemUrl)
      },
    },
    getSources() {
      return [
        {
          sourceId: 'lessons',
          getItemInputValue({item}: any) {
            return item.query
          },
          getItems({query}: any) {
            return getAlgoliaResults({
              searchClient,
              queries: [
                {
                  indexName: 'lessons',
                  query,
                  params: {
                    hitsPerPage: 10,
                  },
                },
              ],
            })
          },
          getItemUrl({item}: any) {
            switch (item.type) {
              case 'lesson': {
                const {module, section, lesson} = getMeta(
                  item,
                  props.product,
                ).query
                return `/learn/${module}/${section}/${lesson}`
              }
              case 'section': {
                const {module, section} = getMeta(item, props.product).query
                return `/learn/${module}/${section}`
              }
            }
          },
        },
      ]
    },
  })

  return (
    <div className="relative flex-grow" {...autocomplete.getRootProps({})}>
      <form
        className="relative"
        {...autocomplete.getFormProps({inputElement: inputRef.current})}
      >
        <label
          className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/75"
          {...autocomplete.getLabelProps({})}
        >
          <SearchIcon className="w-5 h-5" />
        </label>
        <input
          className="block w-full text-sm pl-10 py-3.5 bg-transparent border-none placeholder:text-white/75 text-white rounded-md"
          ref={inputRef}
          {...autocomplete.getInputProps({
            inputElement: inputRef.current as unknown as HTMLInputElement,
          })}
        />
      </form>
      <div
        className="absolute  z-50 w-full"
        {...autocomplete.getPanelProps({})}
      >
        {state.isOpen &&
          state.collections.map((collection: any, index: any) => {
            const {source, items} = collection

            return (
              <div key={`source-${index}`} className="p-1 bg-white rounded-md">
                {items.length > 0 && (
                  <ul className="w-full" {...autocomplete.getListProps()}>
                    {items.map((item: Hit<any>) => {
                      const selected = autocomplete.getItemProps({
                        item,
                        source,
                      })['aria-selected']
                      return (
                        <li
                          key={item.objectID}
                          {...autocomplete.getItemProps({
                            item,
                            source,
                          })}
                        >
                          <Link
                            href={{
                              pathname: getMeta(item, props.product).pathname,
                              query: getMeta(item, props.product).query,
                            }}
                            passHref
                          >
                            <a
                              className={cx(
                                'flex items-center justify-between px-3 py-2 rounded-md w-full transition',
                                {
                                  'bg-gray-100': selected,
                                },
                              )}
                            >
                              <span>
                                {highlight(
                                  parseAlgoliaHitHighlight({
                                    hit: item,
                                    attribute: 'title',
                                  }),
                                )}
                              </span>
                              <span className="text-sm">{item.type}</span>
                            </a>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

const getMeta: any = (item: any, product: any) => {
  switch (item.type) {
    case 'lesson':
      return {
        pathname: '/learn/[module]/[section]/[lesson]',
        query: getPathForLesson(item.path, product.modules),
      }
    case 'section':
      return {
        pathname: '/learn/[module]/[section]',
        query: getPathForSection(item.path, product.modules),
      }
  }
}

export default Autocomplete
