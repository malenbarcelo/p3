import g from "./globals.js"
import { printChartWeek } from "./chartWeek.js"
import { printChartDonut } from "./chartDonut.js"

function printChartWeeks() {

    loader.style.display = 'block'

    const labels = g.weeksEvents.map( we => we.date.replace('/20','/'))
    const values = g.weeksEvents.map( we => we.count)

    const maxVal = Math.max(...values)
    g.maxValWeeks = Math.ceil(maxVal * 1.3) || 10

    Chart.register(ChartDataLabels)

    const lastIdx = (values && values.length) ? values.length - 1 : null
    let selectedKey = (lastIdx !== null) ? `0:${lastIdx}` : null

    // print chart
    const chartInstance = new Chart(document.getElementById('chartWeeks'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
            label: 'Qty',
            data: values,
            borderWidth: 0,
            backgroundColor: ctx => {
                const key = `${ctx.datasetIndex}:${ctx.dataIndex}`
                return key === selectedKey ? 'rgba(0, 125, 186, 1)' : 'rgba(0, 125, 186, 0.3)'
            },
            hoverBackgroundColor: ctx => {
                const key = `${ctx.datasetIndex}:${ctx.dataIndex}`
                return key === selectedKey ? 'rgba(0, 125, 186, 1)' : 'rgba(0, 125, 186, 0.6)'
            },
            borderRadius: 6,
            categoryPercentage: 0.7,
            barPercentage: 0.8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            onHover: (e, els) => {
                const c = e?.native?.target || e.chart?.canvas || e.target
                c.style.cursor = els?.length ? 'pointer' : 'default'
            },
            onClick: (e, elements, chart) => {
                loader.style.display = 'block'
                if (!elements?.length) {
                    loader.style.display = 'none'
                    return
                }
                const el = elements[0]
                const key = `${el.datasetIndex}:${el.index}`

                if (key !== selectedKey) {
                    selectedKey = key
                    chart.update()
                }

                // get selected week data
                g.weeksEventsSelectedIndex = el.index
                printChartWeek()
                printChartDonut()
                
                loader.style.display = 'none'

            },
            scales: {
            x: {
                ticks: { 
                    font: { size: 11, weight: '500', family: 'Poppins, Arial, sans-serif' }, 
                    minRotation: 45, 
                    maxRotation: 45, 
                    autoSkip: false,
                    color: '#495057'
                },
                grid: { display: false },
                border: { display: true, color: '#e9ecef' }
            },
            y: {
                beginAtZero: true,
                max: g.maxValWeeks || 10,
                ticks: { 
                    autoSkip: true, 
                    stepSize: 2, 
                    precision: 0, 
                    includeBounds: false, 
                    font: { size: 11, weight: '500', family: 'Poppins, Arial, sans-serif' },
                    color: '#495057'
                },
                grid: { color: '#f1f3f5', drawBorder: false },
                border: { display: false }
            }
            },
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    offset: 4,
                    formatter: v => (v === 0 ? '0' : (v ?? '')),
                    font: { size: 11, weight: '600', family: 'Poppins, Arial, sans-serif' },
                    color: '#6c757d',
                    display: true
                }
            }
        }
    })

    loader.style.display = 'none'
    
}

export { printChartWeeks }