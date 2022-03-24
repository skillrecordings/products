import * as React from 'react'
import cx from 'classnames'
import indexOf from 'lodash/indexOf'
import find from 'lodash/find'
import {
  ListboxInput,
  ListboxButton as ListboxButtonEl,
  ListboxPopover,
  ListboxList,
  ListboxOption,
} from '@reach/listbox'

export type ListboxItem = {
  label?: string
  value: string
  [key: string]: any
}

type ListboxProps = {
  items: ListboxItem[]
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
  const handleChange = (value: string) => {
    const currentItem = find(items, {value})
    const currentItemIndex = indexOf(items, currentItem)
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
                {items.map((item: any) => (
                  <ListboxOption value={item.value}>{item.label}</ListboxOption>
                ))}
              </ListboxList>
            </ListboxPopover>
          </>
        )}
      </ListboxInput>
    </div>
  )
}
