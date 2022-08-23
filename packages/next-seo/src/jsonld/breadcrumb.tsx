import React from 'react'

import {JsonLd, JsonLdProps} from './jsonld'
import {ItemListElements} from '../types'
import {setItemListElements} from '../utils/schema/setItemListElements'

export interface BreadCrumbJsonLdProps extends JsonLdProps {
  itemListElements: ItemListElements[]
}

function BreadCrumbJsonLd({
  type = 'BreadcrumbList',
  keyOverride,
  itemListElements,
}: BreadCrumbJsonLdProps) {
  const data = {
    itemListElement: setItemListElements(itemListElements),
  }

  return (
    <JsonLd
      type={type}
      keyOverride={keyOverride}
      {...data}
      scriptKey="breadcrumb"
    />
  )
}

export default BreadCrumbJsonLd
