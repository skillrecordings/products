// declare module for typescript
declare module 'convertkit-react/bin/convertkit-react.esm' {
  import React from 'react'
  export interface ConvertKitProps {
    formId: number
  }
  export default class ConvertKit extends React.Component<ConvertKitProps> {}
}
