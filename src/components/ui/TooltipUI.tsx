'use client'

import { Tooltip, TooltipProps } from '@heroui/react'

interface IProps extends TooltipProps {
  children?: React.ReactNode
}

export const TooltipUI = ({ children, ...props }: IProps) => {
  return <Tooltip {...props}>{children}</Tooltip>
}
