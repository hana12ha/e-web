export default function ColorSwatch({ color, selected, onClick, size = 'md' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-7 h-7', lg: 'w-9 h-9' }
  return (
    <button
      onClick={onClick}
      title={color}
      className={`
        ${sizes[size]} rounded-full border-2 transition-all duration-200 flex-shrink-0
        ${selected
          ? 'border-primary-500 scale-110 shadow-glow'
          : 'border-transparent hover:border-gray-300 dark:hover:border-dark-500'
        }
      `}
      style={{ backgroundColor: color }}
    />
  )
}
