import Image from 'next/image'
import Link from 'next/link'

type LogoProps = {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  href?: string
  className?: string
}

const SIZES = {
  sm: { box: 'h-8 w-8', img: 24, text: 'text-base' },
  md: { box: 'h-10 w-10', img: 30, text: 'text-xl' },
  lg: { box: 'h-12 w-12', img: 36, text: 'text-2xl' },
}

// One logo for the whole app. To change the logo later, replace public/logo.svg
export default function Logo({
  size = 'md',
  showText = true,
  href,
  className = '',
}: LogoProps) {
  const s = SIZES[size]

  const content = (
    <span
      className={`inline-flex items-center gap-3 font-bold tracking-tight text-white ${s.text} ${className}`}
    >
      <span
        className={`flex ${s.box} shrink-0 items-center justify-center rounded-lg border border-[#292725] bg-[#11100F]`}
      >
        <Image
          src="/logo.svg"
          alt={showText ? '' : 'MasteryPath'}
          width={s.img}
          height={s.img}
          unoptimized
          priority
        />
      </span>
      {showText && <span>MasteryPath</span>}
    </span>
  )

  return href ? (
    <Link href={href} aria-label="MasteryPath home" className="inline-flex outline-none focus-visible:ring-2 focus-visible:ring-[#6B7280]/50 rounded-lg">
      {content}
    </Link>
  ) : (
    content
  )
}