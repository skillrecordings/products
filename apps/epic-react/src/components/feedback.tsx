import {useMedia} from 'react-use'
import cx from 'classnames'
import {twMerge} from 'tailwind-merge'

import {
  Button,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@skillrecordings/ui'

const Feedback: React.FC<{children: React.ReactNode}> = ({children}) => {
  const isTablet = useMedia('(max-width: 920px)', false)
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild> */}
        <Button
          variant="ghost"
          size="icon"
          className={twMerge(
            cx(
              'w-auto border-none px-3 py-2 text-base text-text transition-opacity duration-150 ease-in-out hover:bg-transparent hover:opacity-100 md:px-2',
              {
                'opacity-100': isTablet,
                'opacity-75': !isTablet,
              },
            ),
          )}
        >
          {children}
          <span className="sr-only">Send Feedback</span>
        </Button>
        {/* </TooltipTrigger>
            {!isTablet && (
              <TooltipContent>
                <p>Send Feedback</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider> */}
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue="Pedro Duarte"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                defaultValue="@peduarte"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default Feedback
