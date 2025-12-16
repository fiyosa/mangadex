// "2025-11-09T10:00:00+00:00" to "2025-11-09 17:00:00" (UTC to WIB +7)
export const formatDateUTCtoWIB = (date: string) => {
  const utcDate = new Date(date)
  utcDate.setHours(utcDate.getHours() + 7)

  const year = utcDate.getFullYear()
  const month = String(utcDate.getMonth() + 1).padStart(2, '0')
  const day = String(utcDate.getDate()).padStart(2, '0')
  const hours = String(utcDate.getHours()).padStart(2, '0')
  const minutes = String(utcDate.getMinutes()).padStart(2, '0')
  const seconds = String(utcDate.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// "2025-11-09T10:00:00+00:00" to "10 minutes ago" (UTC to WIB +7)
export const formatTimeToPublishWIB = (dateUTC: string): string => {
  const publishedDate = new Date(dateUTC)
  // Adjust publish date to WIB (UTC+7)
  publishedDate.setHours(publishedDate.getHours() + 7)

  const now = new Date()
  // Adjust current time to WIB (UTC+7)
  now.setHours(now.getHours() + 7)

  const diffMs = now.getTime() - publishedDate.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffMonths = Math.floor(diffDays / 30) // Approximation
  const diffYears = Math.floor(diffDays / 365) // Approximation

  if (diffYears > 0) {
    return `${diffYears} years ago`
  }
  if (diffMonths > 0) {
    return `${diffMonths} months ago`
  }
  if (diffDays > 0) {
    return `${diffDays} days ago`
  }
  if (diffHours > 0) {
    return `${diffHours} hours ago`
  }
  if (diffMinutes > 0) {
    return `${diffMinutes} minutes ago`
  }
  if (diffSeconds > 0) {
    return `${diffSeconds} seconds ago`
  }
  return 'just now'
}
