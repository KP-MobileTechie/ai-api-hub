import type { ApiStatus } from '@/types/api'

interface Props {
  status: ApiStatus
}

export function StatusBadge({ status }: Props) {
  if (status.alive) {
    return (
      <div className="status-live">
        <div className="dot dot-g" />
        Live
      </div>
    )
  }
  return (
    <div className="status-down">
      <div className="dot dot-r" />
      Down
    </div>
  )
}
