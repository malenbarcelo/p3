
import g from "./globals.js"
import months from "./months.js"
import { f } from "./functions.js"
import { printChartWeeks } from "./chartWeeks.js"
import { printChartWeek } from "./chartWeek.js"
import { printChartDonut } from "./chartDonut.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    // get data
    g.weeksEvents = await f.getWeeksEvents()
    g.daysEvents = await f.getDaysEvents()
    g.monthsEvents = await f.getMonthsEvents()
    g.monthEvents = g.monthsEvents[g.monthsEvents.length - 1]
    g.weeksEventsSelectedIndex = g.weeksEvents.length - 1
    
    // get date
    const date = new Date()
    const monthNumber = date.getMonth() + 1
    const year = date.getFullYear()
    const monthName = months.find(m => m.number == monthNumber).day
    g.currentDate = {date: date, monthNumber: monthNumber, year: year, monthName:monthName, dateName: monthName + ' ' + year}

    // print chartWeeks
    printChartWeeks()

    // print chartWeek
    printChartWeek()

    // print chartDonut
    graterThanLegend.style.backgroundColor = g.graterThanColor
    betweenLegend.style.backgroundColor = g.betweenColor
    lessThanLegend.style.backgroundColor = g.lessThanColor
    graterThanText.innerText =  '> a ' + g.graterThan + ' seg.'
    betweenText.innerText =  'entre ' + g.graterThan + ' y ' + g.lessThan + ' seg.'
    lessThanText.innerText =  '< a ' + g.lessThan + ' seg.'
    

    // change chart donut period
    const checks = [checkMonth, checkWeek]
    checks.forEach(check => {
        check.addEventListener('click',async()=>{
            printChartDonut()
        })  
    })

    checkMonth.click() // print month data by default

    loader.style.display = 'none'

})