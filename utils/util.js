export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export const userInfoFormat = userInfoRes => {
  userInfoRes.rawData = JSON.parse(userInfoRes.rawData)
  return userInfoRes
}

export function generateUniqueStr() {
  return Number(Math.random().toString().substr(3, 12) + Date.now()).toString(36);
}
