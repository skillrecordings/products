import React from 'react'

import {JsonLd, JsonLdProps} from './jsonld'
import {AggregateRating} from '../types'
import {setAggregateRating} from '../utils/schema/setAggregateRating'

export interface BrandJsonLdProps extends JsonLdProps {
  id: string
  slogan?: string
  logo?: string
  aggregateRating?: AggregateRating
}

function BrandJsonLd({
  type = 'Brand',
  id,
  keyOverride,
  aggregateRating,
  ...rest
}: BrandJsonLdProps) {
  const data = {
    aggregateRating: setAggregateRating(aggregateRating),
    '@id': id,
    ...rest,
  }
  return (
    <JsonLd type={type} keyOverride={keyOverride} {...data} scriptKey="brand" />
  )
}

export default BrandJsonLd
