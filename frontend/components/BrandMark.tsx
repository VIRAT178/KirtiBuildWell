'use client'

import React from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { SITE_NAME } from '../lib/site'

const LOGO_PATH = '/brand-wordmark.png'
const BRAND_ARIA_LABEL = `${SITE_NAME} home`

export type BrandMarkProps = {
  href?: string
  layout?: 'inline' | 'stacked'
  stackedAlign?: 'center' | 'start'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  priority?: boolean
}

export function BrandMark({
  href = '/',
  layout = 'inline',
  stackedAlign = 'center',
  size = 'md',
  className = '',
  onClick,
  priority = false
}: BrandMarkProps) {
  const imgClass =
    size === 'sm'
      ? 'h-10 w-auto max-w-[180px] object-contain object-left sm:max-w-[200px] md:h-12 font-bold'
      : size === 'lg'
        ? 'h-16 w-auto max-w-[350px] object-contain object-left md:h-18 md:max-w-[400px] font-bold'
        : 'h-12 w-auto max-w-[250px] object-contain object-left sm:max-w-[300px] md:h-14 md:max-w-[350px] font-bold'

  const inner = (
    <div
      className={clsx(
        'flex min-w-0 items-center',
        layout === 'stacked' ? 'flex-col gap-2' : 'gap-2.5 sm:gap-3',
        layout === 'stacked' && (stackedAlign === 'start' ? 'items-start' : 'items-center'),
        className
      )}
    >
      <span className="inline-flex shrink-0">
        <Image
          src={LOGO_PATH}
          alt={SITE_NAME}
          width={1237}
          height={472}
          priority={priority}
          className={imgClass}
          sizes={size === 'lg' ? '400px' : size === 'sm' ? '200px' : '300px'}
        />
      </span>
    </div>
  )

  const isLink = href !== undefined && href !== ''

  if (isLink) {
    return (
      <Link href={href} className="relative z-10 inline-flex min-w-0 max-w-full" onClick={onClick} aria-label={BRAND_ARIA_LABEL}>
        {inner}
      </Link>
    )
  }

  return <div className="inline-flex min-w-0 max-w-full">{inner}</div>
}
