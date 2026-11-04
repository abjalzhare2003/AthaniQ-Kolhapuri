import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, ...props }, ref) => {
    const inputId = id || props.name
    return (
      <div className="w-full">
        {label && <label htmlFor={inputId} className="label-base">{label}</label>}
        <input
          ref={ref}
          id={inputId}
          className={cn('input-base', error && 'border-red-500 focus:border-red-500 focus:ring-red-500', className)}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {error && <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">{error}</p>}
        {hint && !error && <p id={`${inputId}-hint`} className="mt-1 text-sm text-muted">{hint}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const inputId = id || props.name
    return (
      <div className="w-full">
        {label && <label htmlFor={inputId} className="label-base">{label}</label>}
        <textarea
          ref={ref}
          id={inputId}
          className={cn('input-base resize-y min-h-[100px]', error && 'border-red-500 focus:border-red-500 focus:ring-red-500', className)}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  children: React.ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, className, children, ...props }, ref) => {
    const inputId = id || props.name
    return (
      <div className="w-full">
        {label && <label htmlFor={inputId} className="label-base">{label}</label>}
        <select
          ref={ref}
          id={inputId}
          className={cn('input-base cursor-pointer appearance-none bg-no-repeat', error && 'border-red-500 focus:border-red-500 focus:ring-red-500', className)}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238A8A88' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '16px',
            paddingRight: '2.5rem',
          }}
          aria-invalid={!!error}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  },
)
Select.displayName = 'Select'
// Re-export Button for convenience — many files import { Input, Button } together
export { Button } from './Button'
