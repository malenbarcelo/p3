const datesFunctions = {

    getWeekAndDayNumber: (ts, date) => {
        
        if (!date) {
            date = new Date(ts * 1000)
        }
        
        const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
        const dayNumber = target.getUTCDay() || 7
        target.setUTCDate(target.getUTCDate() + 4 - dayNumber)
        const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1))
        const weekNumber = Math.ceil(((target - yearStart) / 86400000 + 1) / 7)
        return { weekNumber , dayNumber }
    },

    getWeeksInYear: (year) => {
        
        function isLeapYear(y) {
        return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0)
        }

        const lastDay = new Date(year, 11, 31) // 31/12
        const day = lastDay.getDay()

        // Si 31 de diciembre cae en jueves (4) o miércoles (3) en año bisiesto
        if (day === 4 || (day === 3 && isLeapYear(year))) {
            return 53
        }
        return 52
    },

    getWeeksToShow: (firstWeek,year,weeks) => {
        
        const weeksToShow = [{weekNumber:firstWeek,year:year}]
        let yearToAdd = year

        for (let i = 1; i < weeks; i++) {
            let weekToAdd
            const previousWeek = weeksToShow[i-1].weekNumber
            if (previousWeek == 1) {
                yearToAdd = year - 1
                weekToAdd = datesFunctions.getWeeksInYear(yearToAdd)
            }else{
                weekToAdd = previousWeek - 1
            }
            weeksToShow.push({weekNumber:weekToAdd,year:yearToAdd})            
        }

        return weeksToShow.reverse()
    },

    getMondaysToShow: (weeksToShow) => {

        const fmt = new Intl.DateTimeFormat('es-AR', {
            timeZone: 'UTC', // evita cambios por huso horario
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })

        return weeksToShow.map(({ weekNumber, year }) => {
            const jan4 = new Date(Date.UTC(year, 0, 4))
            const jan4IsoDow = jan4.getUTCDay() || 7
            const mondayW1 = new Date(jan4)
            mondayW1.setUTCDate(jan4.getUTCDate() - (jan4IsoDow - 1)) // lunes de la semana 1 (ISO)

            const mondayTarget = new Date(mondayW1)
            mondayTarget.setUTCDate(mondayW1.getUTCDate() + (weekNumber - 1) * 7)

            const parts = Object.fromEntries(fmt.formatToParts(mondayTarget).map(p => [p.type, p.value]))
            const date = `${parts.day}/${parts.month}/${parts.year}`
            const week_year = `${weekNumber}_${parts.year}`

            return { date, weekNumber, year, week_year }
        })
    },

    getNmonths: (monthsToGet) => {

        const date = new Date()
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        const months = [month + '_' + year]

        for (let i = 1; i < monthsToGet; i++) {
            const previuosMonth = Number(months[months.length-1].split('_')[0])
            const previuosYear = Number(months[months.length-1].split('_')[1])
            const month = previuosMonth == 1 ? 12 : (previuosMonth - 1)
            const year = previuosMonth == 1 ? (previuosYear - 1) : previuosYear
            months.push(month + '_' + year)
        }
        
        return months.reverse()
    }

}

module.exports = datesFunctions