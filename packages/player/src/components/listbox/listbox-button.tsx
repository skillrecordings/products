import * as React from 'react'
import cx from 'classnames'
import indexOf from 'lodash/indexOf'
import find from 'lodash/find'
import flatten from 'lodash/flatten'
import {
  ListboxInput,
  ListboxButton as ListboxButtonEl,
  ListboxPopover,
  ListboxList,
  ListboxGroup,
  ListboxOption,
  ListboxGroupLabel,
} from '@reach/listbox'

export type ListboxItem = {
  label?: string
  value: string
  [key: string]: any
}

export type ListboxGroup = {
  label: string
  items: ListboxItem[]
}

type ListboxProps = {
  items: ListboxGroup[]
  selectedItem: ListboxItem
  className?: string
  onSelectItem: (props: any) => void
  title?: string
}

export const ListboxButton: React.FC<ListboxProps> = ({
  items,
  selectedItem,
  className,
  children,
  onSelectItem,
  title,
}) => {
  const values = flatten(items.map((group) => group.items.map((item) => item)))
  const handleChange = (value: string) => {
    const currentItem = find(values, {value})
    const currentItemIndex = indexOf(values, currentItem)
    onSelectItem(currentItemIndex)
  }

  return (
    <div className={cx('cueplayer-react-listbox')}>
      <ListboxInput
        value={selectedItem.value}
        defaultValue={selectedItem.value}
        onChange={(value) => handleChange(value)}
      >
        {({value}) => (
          <>
            <ListboxButtonEl
              title={title}
              data-value={value}
              className={className}
            >
              {children}
            </ListboxButtonEl>
            <ListboxPopover portal={false}>
              <ListboxList>
                {items.map((group: any) => (
                  <div key={group.label}>
                    <ListboxGroupLabel>{group.label}</ListboxGroupLabel>
                    {group.items.map((item: any) => (
                      <ListboxOption
                        aria-label={item.label}
                        value={item.value}
                        key={item.value}
                      >
                        {item.label}
                      </ListboxOption>
                    ))}
                  </div>
                ))}
              </ListboxList>
            </ListboxPopover>
          </>
        )}
      </ListboxInput>
    </div>
  )
}
