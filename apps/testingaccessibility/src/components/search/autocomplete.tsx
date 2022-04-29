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

const Autocomplete = (props: any) => {
  const inputRef = React.useRef(null)
  const router = useRouter()
  const {autocomplete, state} = useAutocomplete({
    id: 'testing-accessibility-search',
    defaultActiveItemId: 0,
    placeholder: 'Search resources',
    debug: true,
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
    <div className="aa-Autocomplete" {...autocomplete.getRootProps({})}>
      <form
        className="aa-Form"
        {...autocomplete.getFormProps({inputElement: inputRef.current})}
      >
        <div className="aa-InputWrapperPrefix">
          <label
            className="aa-Label flex items-center justify-center px-3"
            {...autocomplete.getLabelProps({})}
          >
            <SearchIcon />
          </label>
        </div>
        <div className="aa-InputWrapper">
          <input
            className="aa-Input"
            ref={inputRef}
            {...autocomplete.getInputProps({
              inputElement: inputRef.current as unknown as HTMLInputElement,
            })}
          />
        </div>
      </form>
      <div className="aa-Panel" {...autocomplete.getPanelProps({})}>
        {state.isOpen &&
          state.collections.map((collection: any, index: any) => {
            const {source, items} = collection

            return (
              <div key={`source-${index}`} className="aa-Source">
                {items.length > 0 && (
                  <ul className="aa-List" {...autocomplete.getListProps()}>
                    {items.map((item: Hit<any>) => {
                      return (
                        <li
                          key={item.objectID}
                          className="aa-Item"
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
                            <a className="flex items-center justify-between w-full">
                              <span>
                                {highlight(
                                  parseAlgoliaHitHighlight({
                                    hit: item,
                                    attribute: 'title',
                                  }),
                                )}
                              </span>
                              <span>{item.type}</span>
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
