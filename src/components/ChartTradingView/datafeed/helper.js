export const getLocalTimeZone = () => {
  const localTimezone =
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'exchange'

  if (localTimezone === 'Asia/Saigon') {
    return 'Asia/Ho_Chi_Minh'
  }

  return localTimezone
}
