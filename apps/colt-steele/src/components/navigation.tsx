import Link from 'next/link'

const Navigation = () => {
  return (
    <nav
      aria-label="top"
      className="sm:p-14 p-4 absolute z-50 w-full left-0 top-0"
    >
      <Link href="/" className="inline-flex flex-col">
        <div className="text-2xl font-semibold">Colt Steele</div>
        <div className="font-mono text-xs opacity-60 -translate-y-1">
          Digital Garden
        </div>
      </Link>
    </nav>
  )
}

export default Navigation
