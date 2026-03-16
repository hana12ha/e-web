export default function SizeSelector({ sizes, selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onChange(size)}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-lg border transition-all duration-200
            ${selected === size
              ? 'bg-dark-900 dark:bg-white text-white dark:text-dark-900 border-dark-900 dark:border-white'
              : 'bg-transparent border-gray-300 dark:border-dark-600 text-dark-600 dark:text-dark-300 hover:border-dark-500 dark:hover:border-dark-400'
            }
          `}
        >
          {size}
        </button>
      ))}
    </div>
  )
}
