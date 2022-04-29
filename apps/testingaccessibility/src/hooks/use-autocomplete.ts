import type {
  AutocompleteOptions,
  AutocompleteState,
} from '@algolia/autocomplete-core'
import {createAutocomplete} from '@algolia/autocomplete-core'
import {useMemo, useState} from 'react'
import type {Hit} from '@algolia/client-search'

type AutocompleteItem = Hit<any> // TODO: type this

export function useAutocomplete(props: AutocompleteOptions<AutocompleteItem>) {
  const [state, setState] = useState<AutocompleteState<AutocompleteItem>>(
    () => ({
      collections: [],
      completion: null,
      context: {},
      isOpen: false,
      query: '',
      activeItemId: null,
      status: 'idle',
    }),
  )

  const autocomplete = useMemo(
    () =>
      createAutocomplete<
        AutocompleteItem,
        React.BaseSyntheticEvent,
        React.MouseEvent,
        React.KeyboardEvent
      >({
        ...props,
        onStateChange(params) {
          props.onStateChange?.(params)
          setState(params.state)
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return {autocomplete, state}
}
