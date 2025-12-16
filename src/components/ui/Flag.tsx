'use client'

import ReactCountryFlag, { ReactCountryFlagProps } from 'react-country-flag'

type IProps = ReactCountryFlagProps & {
  countryCode: string
}

export const Flag = ({ countryCode, ...props }: IProps) => {
  return <ReactCountryFlag countryCode={countryCode} {...props} />
}
