import { Minus, Plus } from 'lucide-react'

export default function QuantitySelector({ qty, onChange, max = 99, min = 1 }) {
  return (
    <div className="flex items-center gap-0 border border-gray-200 dark:border-dark-600 rounded-xl overflow-hidden w-fit">
      <button
        onClick={() => onChange(Math.max(min, qty - 1))}
        disabled={qty <= min}
        className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Minus size={14} />
      </button>
      <span className="px-4 py-2 text-sm font-semibold min-w-[2.5rem] text-center border-x border-gray-200 dark:border-dark-600">
        {qty}
      </span>
      <button
        onClick={() => onChange(Math.min(max, qty + 1))}
        disabled={qty >= max}
        className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
