import * as React from 'react'
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
              'w-auto border-none p-2 px-3 text-base text-text transition-opacity duration-150 ease-in-out hover:bg-transparent hover:opacity-100',
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

// import axios from '../../utils/axios'
// import * as Yup from 'yup'
// import Img from 'gatsby-image'
// import mq from '../../utils/mq'
// import Tippy from '@tippyjs/react'
// import isEmpty from 'lodash/isEmpty'
// import {motion} from 'framer-motion'
// import {useStaticQuery, graphql} from 'gatsby'
// import {useInterval, useMedia} from 'react-use'
// import {RemoveScroll} from 'react-remove-scroll'
// import {Formik, Form, Field, ErrorMessage} from 'formik'
// import {useEggheadUser} from '../../hooks/useEggheadUser'
// import {DialogOverlay, DialogContent} from '@reach/dialog'

// import Sob from './images/Sob'
// import Hearteyes from './images/Hearteyes'
// import NeutralFace from './images/NeutralFace'

// const feedbackSchema = Yup.object().shape({
//   emoji: Yup.string(),
//   feedback: Yup.string().when('emoji', {
//     is: undefined,
//     then: Yup.string()
//       .required(
//         `Can't stay empty. Please either pick an emoji or write some feedback. 🙏`,
//       )
//       .min(4, `Too short. Tell me more! 😊`),
//   }),
// })

// const EMOJIS = new Map([
//   [<Hearteyes />, 'heart_eyes'],
//   [<NeutralFace />, 'neutral_face'],
//   [<Sob />, 'sob'],
// ])

// const Feedback = ({className, children}) => {
//   const {authToken, user} = useEggheadUser()
//   const authHeaders = authToken
//     ? {
//         Authorization: `Bearer ${authToken()}`,
//       }
//     : {}

//   const isMobile = useMedia('(max-width: 640px)')
//   const isTablet = useMedia('(max-width: 768px)')

//   const [showDialog, setShowDialog] = React.useState(false)
//   const [state, setState] = React.useState({
//     loading: false,
//     success: false,
//     errorMessage: null,
//   })
//   const openDialog = () => {
//     setShowDialog(true)
//     setState({success: false})
//   }
//   const closeDialog = () => {
//     setShowDialog(false)
//   }

//   useInterval(() => closeDialog(), state.success ? 2650 : null)

//   function handleSubmit(values, actions) {
//     const slackEmojiCode = isEmpty(values.emoji)
//       ? ':unicorn_face:'
//       : `:${values.emoji}:`

//     setState({loading: true})
//     actions.setSubmitting(true)
//     axios
//       .post(
//         `${process.env.AUTH_DOMAIN}/api/v1/feedback`,
//         {
//           feedback: {
//             url: window.location.toString(),
//             site: process.env.SITE_NAME,
//             comment: values.feedback,
//             user: user,
//             emotion: slackEmojiCode,
//           },
//         },
//         {headers: authHeaders},
//       )
//       .then(() => {
//         actions.setSubmitting(false)
//         actions.resetForm()
//         setState({
//           success: true,
//         })
//       })
//       .catch((err) => {
//         actions.setSubmitting(false)
//         setState({success: false, errorMessage: err.message})
//       })
//   }

//   let EMOJI_CODES = null

//   function getEmoji(code) {
//     if (code === null) return code
//     if (EMOJI_CODES === null) {
//       EMOJI_CODES = new Map([...EMOJIS].map(([k, v]) => [v, k]))
//     }
//     return EMOJI_CODES.get(code)
//   }

//   const Emoji = ({code}) => getEmoji(code)

//   const image = useStaticQuery(graphql`
//     query {
//       kent: file(relativePath: {eq: "kent@2x.png"}) {
//         childImageSharp {
//           fluid(maxWidth: 48, quality: 100) {
//             ...GatsbyImageSharpFluid_withWebp_tracedSVG
//           }
//         }
//       }
//     }
//   `)

//   return (
//     <>
//       <Tippy
//         animation={false}
//         content={
//           !isTablet && (
//             <span className="rounded-md border border-gray-100 bg-background p-2 text-xs text-text sm:text-opacity-75">
//               Send Feedback
//             </span>
//           )
//         }
//       >
//         <button className={className} onClick={openDialog} type="button">
//           {children}
//         </button>
//       </Tippy>
//       <DialogOverlay
//         isOpen={showDialog}
//         onDismiss={closeDialog}
//         dangerouslyBypassScrollLock
//         css={mq({
//           background: 'rgba(14, 24, 42, 0.5)',
//           backdropFilter: 'blur(2px)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           padding: '2rem',
//           paddingBottom: [0, 80],
//           zIndex: 40,
//         })}
//       >
//         <RemoveScroll
//           className="w-full"
//           removeScrollBar={isMobile ? true : false}
//         >
//           <DialogContent
//             aria-label="send me your feedback"
//             className={`${
//               state.success ? 'border-green-500' : 'border-indigo-500'
//             }  relative max-w-screen-sm rounded-lg border bg-background text-text shadow-lg`}
//             css={{
//               width: '100%',
//               zIndex: 50,
//             }}
//           >
//             <div className="flex w-full flex-col">
//               {state.success ? (
//                 <motion.div
//                   animate={{opacity: [0, 1]}}
//                   initial={{opacity: 0}}
//                   className="relative flex items-center justify-center"
//                 >
//                   {/* prettier-ignore */}
//                   <div className="w-10 h-10 bg-green-500 flex items-center justify-center rounded-full p-2"><svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none" ><path fillRule="evenodd" clipRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z" fill="currentColor"/></g></svg></div>
//                   <h4 className="ml-4 text-center text-lg font-semibold">
//                     Thank you!
//                   </h4>
//                 </motion.div>
//               ) : (
//                 <>
//                   <h4 className="mb-3 mt-4 text-center text-xl font-semibold">
//                     Tell me how you feel about it
//                   </h4>
//                   <Formik
//                     initialValues={{feedback: '', emoji: ''}}
//                     validationSchema={feedbackSchema}
//                     validateOnBlur={false}
//                     onSubmit={(values, actions) =>
//                       handleSubmit(values, actions)
//                     }
//                   >
//                     {({errors, isValid, touched, isSubmitting, values}) => {
//                       return (
//                         <Form>
//                           <div className="mb-3 flex items-center justify-center">
//                             <div id="emoji" className="mr-3">
//                               Pick an emoji
//                             </div>
//                             <div
//                               role="group"
//                               aria-labelledby="emoji"
//                               className="flex items-center"
//                             >
//                               {Array.from(EMOJIS.values()).map((emoji) => {
//                                 return (
//                                   <label
//                                     className="my-2 flex items-center"
//                                     key={emoji}
//                                   >
//                                     <Field
//                                       disabled={isSubmitting || state.loading}
//                                       type="radio"
//                                       name="emoji"
//                                       value={emoji}
//                                       className="form-radio hidden"
//                                     />
//                                     <div
//                                       className={`mr-2 flex cursor-pointer items-center justify-center rounded-full border border-transparent p-3 transition-colors duration-200 ease-in-out hover:bg-gray-200 ${
//                                         values.emoji === emoji
//                                           ? 'border border-gray-400 bg-gray-300'
//                                           : ''
//                                       }`}
//                                     >
//                                       <Emoji code={emoji} />
//                                     </div>
//                                   </label>
//                                 )
//                               })}
//                             </div>
//                           </div>

//                           <label
//                             htmlFor="feedback"
//                             className="hidden text-sm font-medium leading-5 text-gray-700"
//                           >
//                             Your feedback
//                           </label>
//                           <Field
//                             disabled={isSubmitting || state.loading}
//                             className="form-input focus:shadow-outline-blue h-40 w-full border border-gray-200 bg-background text-text"
//                             component="textarea"
//                             name="feedback"
//                             id="feedback"
//                             placeholder="Type your feedback here..."
//                             aria-label="Enter your feedback"
//                           />
//                           <div className="mt-3 flex w-full items-start justify-between">
//                             <ErrorMessage
//                               name="feedback"
//                               render={(msg) => (
//                                 <div className="mr-3 flex items-start">
//                                   <div>
//                                     <Img
//                                       className="mr-2 h-10 w-10 rounded-full bg-gray-200"
//                                       fluid={image.kent.childImageSharp.fluid}
//                                     />
//                                   </div>
//                                   <div className="flex items-center rounded-lg rounded-tl-none bg-gray-300 px-3 py-2">
//                                     {msg}
//                                     {state.errorMessage &&
//                                       ` & ${state.errorMessage}`}
//                                   </div>
//                                 </div>
//                               )}
//                             />
//                             <div />
//                             <button
//                               className={`${
//                                 errors.feedback &&
//                                 touched.feedback &&
//                                 'cursor-not-allowed'
//                               } mr-2 block rounded-md bg-blue-500 px-4 py-2 text-base font-semibold leading-6 text-white transition-colors duration-200 ease-in-out hover:bg-blue-600`}
//                               disabled={
//                                 !isValid || isSubmitting || state.loading
//                               }
//                               type="submit"
//                             >
//                               {isSubmitting || state.loading
//                                 ? 'Sending...'
//                                 : 'Send'}
//                             </button>
//                           </div>
//                         </Form>
//                       )
//                     }}
//                   </Formik>
//                 </>
//               )}
//             </div>
//             <div className="absolute right-0 top-0 block pr-3 pt-3 sm:pr-4 sm:pt-4">
//               <button
//                 onClick={closeDialog}
//                 type="button"
//                 className={`${
//                   state.success
//                     ? 'text-gray-700'
//                     : 'focus:shadow-outline-blue p-2 text-gray-600 hover:bg-gray-200 '
//                 } rounded-full transition-colors duration-200 ease-in-out hover:text-text focus:text-text focus:outline-none`}
//                 aria-label="Close"
//               >
//                 {/* prettier-ignore */}
//                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
//               </button>
//               {state.success && (
//                 <svg
//                   className="pointer-events-none absolute right-0 top-0 w-12 text-green-400 sm:right-1 sm:top-1"
//                   viewBox="-10 -10 60 60"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   {/* prettier-ignore */}
//                   <motion.path d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0" fill="none" stroke="currentColor" strokeWidth="3px" strokeDasharray="0 1"
//                       animate={{
//                         pathLength: [0, 1],
//                         opacity: [0.2, 1],
//                       }}
//                       transition={{
//                         duration: 2.5,
//                         type: 'spring',
//                       }}
//                     />
//                 </svg>
//               )}
//             </div>
//           </DialogContent>
//         </RemoveScroll>
//       </DialogOverlay>
//     </>
//   )
// }

// export default Feedback
