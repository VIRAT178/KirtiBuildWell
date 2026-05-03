'use client'

import React from 'react'
import clsx from 'clsx'
import Link from 'next/link'

export type BrandMarkProps = {
  /** Use `undefined` or `''` for a non-clickable mark (wrap yourself if needed). */
  href?: string
  layout?: 'inline' | 'stacked'
  /** When `layout` is stacked, align logo + wordmark (sidebar vs centered hero). */
  stackedAlign?: 'center' | 'start'
  size?: 'sm' | 'md' | 'lg'
  showWordmark?: boolean
  className?: string
  onClick?: () => void
  /** Hint LCP for above-the-fold header logo */
  priority?: boolean
}

export function BrandMark({
  href = '/',
  layout = 'inline',
  stackedAlign = 'center',
  size = 'md',
  showWordmark = true,
  className = '',
  onClick,
  priority = false
}: BrandMarkProps) {
  const imgClass =
    size === 'sm'
      ? 'h-7 w-auto max-w-[90px] object-contain object-left sm:max-w-[110px] md:h-8'
      : size === 'lg'
        ? 'h-10 w-auto max-w-[160px] object-contain object-left md:h-12 md:max-w-[200px]'
        : 'h-8 w-auto max-w-[110px] object-contain object-left sm:max-w-[130px] md:h-9 md:max-w-[160px]'

  const textClass =
    size === 'sm'
      ? 'text-sm sm:text-base'
      : size === 'lg'
        ? 'text-lg md:text-xl'
        : 'text-base md:text-lg'

  const inner = (
    <div
      className={clsx(
        'flex gap-2.5 sm:gap-3',
        layout === 'inline' && 'items-center',
        layout === 'stacked' && 'flex-col',
        layout === 'stacked' && (stackedAlign === 'start' ? 'items-start' : 'items-center'),
        className
      )}
    >
      <img
        src="/logo.png"
        alt={showWordmark ? '' : 'Kirti BuildWell'}
        width={200}
        height={56}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        className={imgClass}
        aria-hidden={showWordmark}
      />
      {showWordmark ? (
        <span
          className={clsx(
            'font-display font-semibold leading-tight tracking-tight',
            textClass,
            layout === 'stacked' && stackedAlign === 'center' && 'text-center',
            layout === 'stacked' && stackedAlign === 'start' && 'text-left'
          )}
        >
          <span className="gold-gradient-text">Kirti</span>
          <span className="text-white/95"> BuildWell</span>
        </span>
      ) : null}
    </div>
  )

  const isLink = href !== undefined && href !== ''

  if (isLink) {
    return (
      <Link href={href} className="relative z-10 inline-flex min-w-0 max-w-full" onClick={onClick} aria-label="Kirti BuildWell home">
        {inner}
      </Link>
    )
  }

  return <div className="inline-flex min-w-0 max-w-full">{inner}</div>
}
