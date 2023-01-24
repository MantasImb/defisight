export function getAge(timestamp, short = false, date = new Date().getTime()) {
  let difference = date - timestamp * 1000

  let totalSeconds = Math.floor(difference / 1000)
  // if (totalSeconds <= 59 && !short) return `<1 min`
  // else if (totalSeconds <= 59 && short) return `<1 m`
  if (totalSeconds <= 59 && !short) return `${totalSeconds} secs`
  else if (totalSeconds <= 59 && short) return `${totalSeconds} s`

  let totalMinutes = Math.floor(difference / (1000 * 60))
  if (totalMinutes <= 59 && !short) return `${totalMinutes} mins`
  else if (totalMinutes <= 59 && short) return `${totalMinutes} m`

  let totalHours = Math.floor(difference / (1000 * 3600))
  if (totalHours <= 23 && !short) return `${totalHours} hours`
  else if (totalHours <= 23 && short) return `${totalHours} h`

  let totalDays = Math.floor(difference / (1000 * 3600 * 24))
  if (totalDays <= 89 && !short) return `${totalDays} days`
  else if (totalDays <= 89 && short) return `${totalDays} d`

  let totalMonths = Math.floor(difference / (1000 * 3600 * 24 * 30))
  if (totalMonths <= 23 && !short) return `${totalMonths} months`
  else if (totalMonths <= 23 && short) return `${totalMonths} mo`

  let totalYears = Math.ceil(difference / (1000 * 3600 * 24 * 365))
  if (!short) return `${totalYears} years`
  else if (short) return `${totalYears} y`
}

function getAgeTest(timeNow, timestamp) {
  let difference = timeNow - timestamp * 1000
  console.log(difference)
  let TotalYears = Math.ceil(difference / (1000 * 3600 * 24 * 30 * 365))
  let TotalMonths = Math.ceil(difference / (1000 * 3600 * 24 * 30))
  let TotalDays = Math.ceil(difference / (1000 * 3600 * 24))
  let TotalHours = Math.ceil(difference / (1000 * 3600))
  let TotalMinutes = Math.ceil(difference / (1000 * 60))
  let TotalSeconds = Math.ceil(difference / 1000)

  console.log(
    `Y:${TotalYears} M:${TotalMonths} D:${TotalDays}, H:${TotalHours}, M:${TotalMinutes}, S:${TotalSeconds}`
  )
}
