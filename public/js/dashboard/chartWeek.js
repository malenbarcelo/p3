import g from "./globals.js"

function printChartWeek() {

    loader.style.display = 'block'

    // destroy chart if exists
    const inst = Chart.getChart(chartWeek)
    if (inst) inst.destroy()

    // get data
    g.weekEvents = g.daysEvents.filter( de => de.weekNumber == g.weeksEvents[g.weeksEventsSelectedIndex].weekNumber)
    chartWeekTitle.innerText = 'SEMANA ' + g.weeksEvents[g.weeksEventsSelectedIndex].date
    const labels = ['Lunes', 'Martes','Miércoles','Jueves','Viernes','Sábado','Domingo']
    const values = g.weekEvents.map( we => we.count)

    const maxVal = Math.max(...values)

    Chart.register(ChartDataLabels)

    // print chart
    new Chart(document.getElementById('chartWeek'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Qty',
                data: values,
                borderWidth: 0,
                backgroundColor: '#051435',
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
            scales: {
            x: {
                ticks: { font: { size: 11, weight: '600' }, minRotation: 45, maxRotation: 45, autoSkip: false },
                grid: { drawOnChartArea: false }
            },
            y: {
                beginAtZero: true,
                max: maxVal > 0 ? maxVal * 1.2 : 10,
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

export { printChartWeek }