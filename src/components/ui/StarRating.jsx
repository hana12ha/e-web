import { Star } from 'lucide-react'

export default function StarRating({ rating, count, size = 14 }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={
              star <= Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : star - 0.5 <= rating
                ? 'fill-yellow-200 text-yellow-400'
                : 'fill-none text-gray-300'
            }
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-dark-400 dark:text-dark-500">({count})</span>
      )}
    </div>
  )
}
