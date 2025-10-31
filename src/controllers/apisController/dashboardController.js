
const gf = require("../../functions/globalFunctions")
const df = require("../../functions/datesFunctions")
const wd = require("../../data/weekDays")

const statisticsController = {
    daysEvents: async(req,res) =>{
        try{

            const days = 120
            
            // days to get
            const daysToGet = parseInt(days) + 10

            // date from
            const tsToday = Math.floor(Date.now() / 1000)
            const daysToGetSec = daysToGet * 24 * 60 * 60
            const tsDaysToGetInit = tsToday - daysToGetSec

            // filters
            const filters = {}

            if (days) {
                filters.date_from = tsDaysToGetInit
            }

            // get data
            let data = await gf.getDetectedEvents(undefined, undefined, filters)
            data = data.rows

            // group data
            data = await gf.groupDataByDay(data)

            // get last n dates
            let datesToShow = gf.getNdays(days)
            let dates = []
            datesToShow.forEach(date => {
                const [dd, mm, yyyy] = date.split('/').map(Number)
                const getDate = new Date(yyyy, mm - 1, dd)
                const {weekNumber, dayNumber} = df.getWeekAndDayNumber(undefined,getDate)
                const day = wd.find( d => d.number == dayNumber).day
                dates.push({date, weekNumber, dayNumber, day})
            })            

            // fill dates
            data = gf.fillMissingDates(dates, data)

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    weeksEvents: async(req,res) =>{
        try{

            let {grater_than, less_than } = req.query

            date = new Date()                
            year = date.getFullYear()

            // get week number
            const { weekNumber , dayNumber } = df.getWeekAndDayNumber(undefined, date)

            // get weeks to show
            const weeksToShow = df.getWeeksToShow(weekNumber,year, 13) // show 13 weeks, 3 months

            // get dates to show
            let datesToShow = df.getMondaysToShow(weeksToShow)

            // get detected events last 150 days
            // filters
            const tsToday = Math.floor(Date.now() / 1000)
            const daysToGetSec = 13 * 7 * 24 * 60 * 60 // 13 weeks
            const tsDaysToGetInit = tsToday - daysToGetSec

            const filters = {}
            filters.date_from = tsDaysToGetInit

            let data = await gf.getDetectedEvents(undefined, undefined, filters)
            data = data.rows

            // group data
            weeksData = await gf.groupDataByWeek(data)

            // get grater and less
            grater_than = grater_than || 9
            less_than = less_than || 7

            weeksData.forEach(element => {
                element['grater_than_' + grater_than] = data.filter( d => d.week_number == element.weekNumber && d.year == element.year && d.duration_seconds > grater_than).length
                element['less_than_' + less_than] = data.filter( d => d.week_number == element.weekNumber && d.year == element.year && d.duration_seconds < less_than).length
                element['between_' + grater_than + '_and_' + less_than] = data.filter( d => d.week_number == element.weekNumber && d.year == element.year ).length - element['grater_than_' + grater_than] - element['less_than_' + less_than]
            });

            // fill dates
            datesToShow = datesToShow.map(date => {

                const findElement = weeksData.find(d => d.weekNumber === date.weekNumber && d.year === date.year)                
                
                date.count = findElement ? findElement.count : 0
                date.avg_duration_seconds = findElement ? findElement.avg_duration_seconds : 0
                
                date['grater_than_' + grater_than] = findElement ? findElement['grater_than_' + grater_than] : 0
                date['less_than_' + less_than] = findElement ? findElement['less_than_' + less_than] : 0
                date['between_' + grater_than + '_and_' + less_than] = findElement ? findElement['between_' + grater_than + '_and_' + less_than] : 0
                
                return date
            })

            // add variation
            for (let i = 0; i < datesToShow.length; i++) {
                if (i == 0) {
                    datesToShow[i].duration_variation = 'S/D'
                }else{
                    if (datesToShow[i-1].count != 0) {
                        datesToShow[i].duration_variation = datesToShow[i].avg_duration_seconds / datesToShow[i-1].avg_duration_seconds - 1
                    }else{
                        datesToShow[i].duration_variation = 1
                    }
                }              
            }

            datesToShow = datesToShow.slice(1) // 12 weeks

            res.status(200).json(datesToShow)

        }catch(error){
            console.log(error)

            return res
                .status(500)
                .type('application/json')
                .json({ ok: false, error: 'Ha ocurrido un error' })
        }
    },

    monthsEvents: async(req,res) =>{
        try{

            let {grater_than, less_than, months_to_get } = req.query

            // get months to get            
            let monthsToShow = df.getNmonths(Number(months_to_get) + 1 || 4)

            // get detected events last n days
            // filters
            const weeks = (Number(months_to_get + 1) * 4 + 1) || 16
            const tsToday = Math.floor(Date.now() / 1000)
            const daysToGetSec = weeks * 7 * 24 * 60 * 60 // 13 weeks or by params
            const tsDaysToGetInit = tsToday - daysToGetSec

            const filters = {}
            filters.date_from = tsDaysToGetInit

            let data = await gf.getDetectedEvents(undefined, undefined, filters)
            data = data.rows

            // group data
            const monthData = await gf.groupDataByMonth(data)

            // get grater and less
            grater_than = grater_than || 9
            less_than = less_than || 7

            monthData.forEach(element => {
                element['grater_than_' + grater_than] = data.filter( d => d.month_year == element.month_year && d.duration_seconds > grater_than).length
                element['less_than_' + less_than] = data.filter( d => d.month_year == element.month_year && d.duration_seconds < less_than).length
                element['between_' + grater_than + '_and_' + less_than] = data.filter( d => d.month_year == element.month_year).length - element['grater_than_' + grater_than] - element['less_than_' + less_than]
                
            });

            // fill dates
            let monthsData = []
            monthsToShow.forEach(m => {
                monthsData.push({month_year:m})
            })

            monthsData =monthsData.map(date => {

                    const findElement = monthData.find(md => md.month_year === date.month_year)                
                    
                    date.count = findElement ? findElement.count : 0
                    date.avg_duration_seconds = findElement ? findElement.avg_duration_seconds : 0
                    
                    date['grater_than_' + grater_than] = findElement ? findElement['grater_than_' + grater_than] : 0
                    date['less_than_' + less_than] = findElement ? findElement['less_than_' + less_than] : 0
                    date['between_' + grater_than + '_and_' + less_than] = findElement ? findElement['between_' + grater_than + '_and_' + less_than] : 0
                    
                    return date
                })

            // add variation
            for (let i = 0; i < monthsData.length; i++) {
                monthsData[i].duration_variation = i == 0 ? 'S/D' : (monthsData[i].avg_duration_seconds / monthsData[i-1].avg_duration_seconds - 1)
                
            }

            res.status(200).json(monthsData)

        }catch(error){
            console.log(error)

            return res
                .status(500)
                .type('application/json')
                .json({ ok: false, error: 'Ha ocurrido un error' })
        }
    },
}
module.exports = statisticsController

