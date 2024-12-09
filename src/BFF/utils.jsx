const shortenWord = (string, len = 50) => {
    if (string.length < len) return string
    const t = string.slice(0, len)
    return t + '...'
}
const toCamelCase = (f) => {
    let k = f.split('')
    k[0] = k[0].toUpperCase()
    return k
}

const getDate = (l) => {
    if (!l) return ''
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]; let month = monthNames[l.getMonth()]
    let date = l.getDate()
    let year = l.getFullYear()
    return { date: `${month} ${date} ${year}`, month}
}

const getDayOfWeek = (l) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let d = getDate(l)

    return `${days[l.getDay()]} ${d}`
}
const getTime = (l) => {
    const time = l.getHours()
    const p = time >= 12 ? 'PM' : 'AM'
    const fh = time % 12 || 12
    const min = l.getMinutes()
    return `${fh}:${min} ${p}`
}

export {

    getTime,
    getDate,
    shortenWord,
    toCamelCase,
    getDayOfWeek
}