type Props = {
  children: React.ReactNode
  label: string
  htmlFor?: string
  required: boolean
}

export default function InputLabel({
  children,
  label,
  htmlFor,
  required = false,
}: Props) {
  return (
    <div className="flex w-full flex-col  ">
      <label htmlFor={htmlFor} className="flex gap-1">
        {label}
        {required && <span className="text-red-500 ">*</span>}
      </label>
      {children}
    </div>
  )
}
