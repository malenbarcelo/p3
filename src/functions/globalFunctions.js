const detectedEventsQueries = require("../dbQueries/detectedEventsQueries")
const df = require("./datesFunctions")
const weekDays = require("../data/weekDays")
const months = require("../data/months")
const fsp = require('fs/promises')
const path = require('path')

const globalFunctions = {
    specialChars: (value) => {
        if (typeof value !== 'string') return value // Solo procesa si es string
        return value.replace(/[%_]/g, char => `\\${char}`)
    },

    dateTimeFromTs: (ts) => {
        const ms = String(ts).length === 10 ? ts * 1000 : ts // seconds → ms
        const d = new Date(ms)
        const parts = Object.fromEntries(
            new Intl.DateTimeFormat('es-AR', {
            timeZone: 'America/Argentina/Buenos_Aires',
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
            }).formatToParts(d).map(p => [p.type, p.value])
        )
        return `${parts.day}/${parts.month}/${parts.year} ${parts.hour}:${parts.minute}:${parts.second}`
    },

    getDetectedEvents: async(limit, offset, filters) => {
        
        let data = await detectedEventsQueries.get({ limit, offset, filters })

        // add week number
        data.rows.forEach(row => {
            const dayNumber = df.getWeekAndDayNumber(row.start_timestamp, undefined).dayNumber            
            row.week_number = df.getWeekAndDayNumber(row.start_timestamp, undefined).weekNumber
            row.day = weekDays.filter( w => w.number == dayNumber)          
        })

        // add month and year
        data.rows.forEach(row => {
            const monthNumber = Number(row.date.split('/')[1])
            row.month = months.find( m => m.number == monthNumber)
            row.year = Number(row.date.split('/')[2])
            row.month_year = row.month.number + '_' + row.year
            row.week_year = row.week_number + '_' + row.year
        })

        // find videos
        for (let i = 0; i < data.rows.length; i++) {
            const videoPath = path.join(__dirname,`../../public/videos/${data.rows[i].video}.mp4`)
            try {
                await fsp.access(videoPath)
                data.rows[i].findVideo = 1
            } catch {
                data.rows[i].findVideo = 0
            }
        }

        return data
    },

    groupDataByDay: async(data) => {

        const acc = new Map()

        for (const d of data) {
            const key = d.date.trim()
            const cur = acc.get(key) || { count: 0, sum: 0, weekNumber: undefined, day: undefined }

            // sumarización
            cur.count++
            cur.sum += Number(d.duration_seconds) || 0

            // tomar weekNumber y day del primer item que veamos para esa fecha
            if (cur.weekNumber === undefined) cur.weekNumber = d.week_number
            if (cur.day === undefined) {
            // si viene como array ([{ number, day }]) me quedo con el primero
            cur.day = Array.isArray(d.day) ? d.day[0] : d.day
            }

            acc.set(key, cur)
        }

        return [...acc.entries()]
            .map(([date, { count, sum, weekNumber, day }]) => ({
                date,
                count,
                avg_duration_seconds: Math.round((sum / count) * 100) / 100,
                week_number: weekNumber,
                day 
            }))
            .sort((a, b) => {
                const [da, ma, ya] = a.date.split('/').map(Number)
                const [db, mb, yb] = b.date.split('/').map(Number)
                const ta = ya*1e4 + ma*1e2 + da
                const tb = yb*1e4 + mb*1e2 + db
                return ta - tb
            })
    },

    groupDataByWeek: async(data) => {

        const acc = new Map()

        for (const d of data) {
            const year = d.year
            const week = d.week_number
            const key = d.week_year

            const cur = acc.get(key) || { year, weekNumber: week, count: 0, sum: 0 }
            cur.count++
            cur.sum += Number(d.duration_seconds) || 0
            acc.set(key, cur)
        }

        return [...acc.values()]
            .map(({ year, weekNumber, count, sum }) => ({
                year,
                weekNumber,
                count,
                avg_duration_seconds: Math.round((sum / count) * 100) / 100
            }))
            .sort((a, b) => (a.year - b.year) || (a.weekNumber - b.weekNumber))
    
    },

    groupDataByMonth: async(data) => {
        
        const acc = new Map()

        for (const d of data || []) {
            const my = d.month_year
            const month = d.month.number
            const year = d.year
            const dur = Number(d?.duration_seconds) || 0

            const cur = acc.get(my) || {
                month,
                year,
                month_year: my,
                count: 0,
                total_duration_seconds: 0
            }

            cur.count += 1
            cur.total_duration_seconds += dur
            acc.set(my, cur)
        }

        const rows = [...acc.values()].map(r => ({
            month: r.month,
            year: r.year,
            month_year: r.month_year,                       // "M_YYYY"
            count: r.count,
            total_duration_seconds: r.total_duration_seconds,
            avg_duration_seconds: r.count
            ? Math.round((r.total_duration_seconds / r.count) * 100) / 100
            : 0
        }))

        // orden cronológico: año, luego mes
        rows.sort((a, b) => (a.year - b.year) || (a.month - b.month))

        return rows
    },

    getNdays: (days) => {

        const tz = 'America/Argentina/Buenos_Aires'
        const fmt = new Intl.DateTimeFormat('es-AR', {
            timeZone: tz,
            day: '2-digit', month: '2-digit', year: 'numeric'
        })

        const format = d => {
            const parts = Object.fromEntries(fmt.formatToParts(d).map(p => [p.type, p.value]))
            return `${parts.day}/${parts.month}/${parts.year}`
        }

        return Array.from({ length: days }, (_, i) => {
            const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
            return format(d)
        }).reverse()

    },

    fillMissingDates: (dates, data) => {
        
        const byDate = new Map(
            data.map(d => [d.date, {
                count: Number(d.count) || 0,
                avg_duration_seconds: Number(d.avg_duration_seconds) || 0
            }])
        )

        return dates.map(date => {
            const found = byDate.get(date.date)
            return {
                date: date.date,
                weekNumber: date.weekNumber,
                dayNumber: date.dayNumber,
                day: date.day,
                count: found?.count ?? 0,
                avg_duration_seconds: found?.avg_duration_seconds ?? 0,
            }
        })

    }

        
}

module.exports = globalFunctions