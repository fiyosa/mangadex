'use client'

import { Button, ButtonProps } from '@heroui/react'

interface IProps extends ButtonProps {
  children?: React.ReactNode
}

export const Btn = ({ children, ...props }: IProps) => {
  return <Button {...props}>{children}</Button>
}
