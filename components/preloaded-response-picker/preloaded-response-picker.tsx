import { useState } from 'react'

export type ResponseOption = {
  label: string
  value: string
}

export type PreloadedResponsePickerProps = {
  onSelect: (options: ResponseOption[]) => void
}

const COMMON_RESPONSE_SETS: { name: string; options: ResponseOption[] }[] = [
  {
    name: 'Good / Fair / Poor',
    options: [
      { label: 'Good', value: 'good' },
      { label: 'Fair', value: 'fair' },
      { label: 'Poor', value: 'poor' },
      { label: 'N/A', value: 'n/a' },
    ],
  },
  {
    name: 'Safe / At Risk',
    options: [
      { label: 'Safe', value: 'safe' },
      { label: 'At Risk', value: 'at-risk' },
      { label: 'N/A', value: 'n/a' },
    ],
  },
  {
    name: 'Pass / Fail',
    options: [
      { label: 'Pass', value: 'pass' },
      { label: 'Fail', value: 'fail' },
      { label: 'N/A', value: 'n/a' },
    ],
  },
  {
    name: 'Yes / No',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
      { label: 'N/A', value: 'n/a' },
    ],
  },
  {
    name: 'Compliant / Non-Compliant',
    options: [
      { label: 'Compliant', value: 'compliant' },
      { label: 'Non-Compliant', value: 'non-compliant' },
      { label: 'N/A', value: 'n/a' },
    ],
  },
]

export function PreloadedResponsePicker({
  onSelect,
}: PreloadedResponsePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="my-2">
      <button
        type="button"
        className="text-sm underline text-blue-600 hover:text-blue-800"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="preloaded-response-list"
      >
        Choose from common sets
      </button>
      {open && (
        <div
          id="preloaded-response-list"
          className="mt-2 border rounded bg-white shadow p-2 w-64 z-10"
        >
          <ul>
            {COMMON_RESPONSE_SETS.map((set) => (
              <li key={set.name} className="mb-2 last:mb-0">
                <button
                  type="button"
                  className="w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                  onClick={() => {
                    onSelect(set.options)
                    setOpen(false)
                  }}
                >
                  {set.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
