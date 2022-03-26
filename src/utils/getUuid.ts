let seed = 0
const now = Date.now()
const getUuid = () => {
  const id = seed
  seed += 1
  return `rcNotification_${now}_${id}`
}

export default getUuid
