import * as React from 'react'
import cx from 'classnames'
import indexOf from 'lodash/indexOf'
import find from 'lodash/find'
import flatten from 'lodash/flatten'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

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

export const ListboxButton: React.FC<React.PropsWithChildren<ListboxProps>> = ({
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
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>{children}</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            loop
            data-cueplayer-react-listbox=""
            side="top"
            className="cueplayer-react-listbox"
          >
            {items.map((group: any) => (
              <DropdownMenu.RadioGroup
                value={selectedItem.value}
                key={group.label}
              >
                <DropdownMenu.Label className="cueplayer-react-listbox-label">
                  {group.label}
                </DropdownMenu.Label>
                {group.items.map((item: any) => (
                  <DropdownMenu.RadioItem
                    onSelect={() => handleChange(item.value)}
                    aria-label={item.label}
                    value={item.value}
                    key={item.value}
                    textValue={item.value}
                  >
                    {item.label}
                  </DropdownMenu.RadioItem>
                ))}
              </DropdownMenu.RadioGroup>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  )
}
