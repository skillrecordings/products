import * as React from 'react'

interface MobileNavigationProps {
  setOpen: (isOpen: boolean) => void
}

const MobileNavigation: React.FC<
  React.PropsWithChildren<MobileNavigationProps>
> = ({setOpen, children}) => {
  const menuHolderRef = React.useRef<HTMLDivElement>(null)

  const clickHandler = React.useCallback(
    (e: MouseEvent) => {
      const clickedElement = e.target as HTMLElement
      const naviItem = clickedElement.closest('[data-navi-item]') as HTMLElement
      if (naviItem) {
        setOpen(false)
      }
    },
    [setOpen],
  )

  React.useEffect(() => {
    const menuHolder = menuHolderRef.current
    if (menuHolder) {
      menuHolder.addEventListener('click', clickHandler)
    }
    return () => {
      if (menuHolder) {
        menuHolder.removeEventListener('click', clickHandler)
      }
    }
  }, [clickHandler])

  return (
    <div
      ref={menuHolderRef}
      className="navigation absolute left-0 top-[3.25rem] mt-1 grid w-full grid-flow-row justify-start p-3"
    >
      {children}
    </div>
  )
}

export default MobileNavigation
