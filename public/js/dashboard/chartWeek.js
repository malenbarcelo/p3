import g from "./globals.js"

function printChartWeek() {

    loader.style.display = 'block'

    // destroy chart if exists
    const inst = Chart.getChart(chartWeek)
    if (inst) inst.destroy()

    // get data
    g.weekEvents = g.daysEvents.filter( de => de.weekNumber == g.weeksEvents[g.weeksEventsSelectedIndex].weekNumber)
    chartWeekTitle.innerText = 'SEMANA ' + g.weeksEvents[g.weeksEventsSelectedIndex].date
    const labels = ['Lun', 'Mar','Mié','Jue','Vie','Sáb','Dom']
    const values = g.weekEvents.map( we => we.count)

    const maxVal = Math.max(...values)
    
    // Asegurar que g.maxValWeeks esté definido
    if (!g.maxValWeeks) {
        g.maxValWeeks = Math.ceil(maxVal * 1.3) || 10
    }

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
                backgroundColor: 'rgba(0, 125, 186, 1)',
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
                c.style.cursor = 'default'
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

export { printChartWeek }