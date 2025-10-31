import g from "./globals.js"
import { printChartWeek } from "./chartWeek.js"
import { printChartDonut } from "./chartDonut.js"

function printChartWeeks() {

    loader.style.display = 'block'

    const labels = g.weeksEvents.map( we => we.date.replace('/20','/'))
    const values = g.weeksEvents.map( we => we.count)

    const maxVal = Math.max(...values)

    Chart.register(ChartDataLabels)

    const lastIdx = (values && values.length) ? values.length - 1 : null
    let selectedKey = (lastIdx !== null) ? `0:${lastIdx}` : null

    // print chart
    new Chart(document.getElementById('chartWeeks'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
            label: 'Qty',
            data: values,
            borderWidth: 0,
            backgroundColor: ctx => {
                const key = `${ctx.datasetIndex}:${ctx.dataIndex}`
                return key === selectedKey ? '#051435' : '#9fa9c2ff'
            },
            categoryPercentage: 0.6,
            barPercentage: 0.7
            }]
        },
        options: {
            responsive: true,
            onHover: (e, els) => {
                const c = e?.native?.target || e.chart?.canvas || e.target
                c.style.cursor = els?.length ? 'pointer' : 'default'
            },
            onClick: (e, elements, chart) => {          // <— agregá el 3er parámetro
                loader.style.display = 'block'
                if (!elements?.length) {                   // si no hay barra, apaga loader y salí
                    loader.style.display = 'none'
                    return
                }
                const el = elements[0]
                const key = `${el.datasetIndex}:${el.index}`

                if (key !== selectedKey) {
                    selectedKey = key       // cambia solo si es otra barra
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
                ticks: { font: { size: 11, weight: '600' }, minRotation: 45, maxRotation: 45, autoSkip: false },
                grid: { drawOnChartArea: false }
            },
            y: {
                beginAtZero: true,
                max: maxVal > 0 ? maxVal * 1.2 : 1,
                ticks: { autoSkip: true, stepSize: 1, precision: 0, includeBounds: false, font: { size: 10 } }
            }
            },
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    offset: 2,
                    formatter: v => (v === 0 ? '0' : (v ?? '')),
                    font: { size: 10, weight: '400' },
                    color: '#333',
                    display: true
                }
            }
        }
    })

    loader.style.display = 'none'
    
}

export { printChartWeeks }