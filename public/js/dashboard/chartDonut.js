import g from "./globals.js"

function printChartDonut() {

    loader.style.display = 'block'

    // destroy chart if exists
    const inst = Chart.getChart(chartDonut)
    if (inst) inst.destroy()

    // labels and data
    const data = checkMonth.checked ? g.monthEvents : g.weeksEvents[g.weeksEventsSelectedIndex]

    checkMonthLabel.innerText = g.currentDate.dateName  
    checkWeekLabel.innerText = 'Semana ' + g.weeksEvents[g.weeksEventsSelectedIndex].date
    durationAvg.innerHTML = '<b>PROMEDIO: </b>' + parseFloat(data.avg_duration_seconds).toFixed(2)  + ' seg.'
    const variation = parseFloat(data.duration_variation * 100).toFixed(2)
    const period = checkMonth.checked ? 'mes' : 'semana'
    const variationIcon = data.duration_variation > 0 ? '<i class="fa-solid fa-arrow-up"></i>' : '<i class="fa-solid fa-arrow-down"></i>'
    durationVar.innerHTML = variationIcon + ' <b>' + variation + '%</b> vs ' + period + ' anterior'
    durationVar.style.color = data.duration_variation > 0 ? 'red' : 'green'

    //chart
    if (data.count != 0) {

        dataBox.style.display = 'flex'
        legend.style.display = 'flex'
        noData.style.display = 'none'

        const d = { graterThan:data['grater_than_' + g.graterThan], between: data['between_' + g.graterThan + '_and_' + g.lessThan],lessThan:data['less_than_' + g.lessThan]}
    
        const keys   = ['graterThan', 'between', 'lessThan']
        const labels = ['graterThan', 'between', 'lessThan']
        const values = keys.map(k => Number(d[k] || 0))

        console.log(data)
        // console.log(data['grater_than_' + g.graterThan])
        // console.log(d)

        const colors = [g.graterThanColor, g.betweenColor, g.lessThanColor]

        Chart.register(ChartDataLabels)

        const lastIdx = (values && values.length) ? values.length - 1 : null
        let selectedKey = (lastIdx !== null) ? `0:${lastIdx}` : null
    
        // print chart
        new Chart(document.getElementById('chartDonut'), {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data: values,
                    // color dinámico según selección
                    backgroundColor: ctx => {
                        const key = `${ctx.datasetIndex}:${ctx.dataIndex}`
                        const i = ctx.dataIndex
                        return colors[i]
                    },
                    borderWidth: 0,
                    borderRadius: 0,
                    spacing: 0,
                    hoverOffset: 0
                }]
            },
            options: {
                responsive: true,
                cutout: '60%',
                rotation: -90, // arranca arriba
                interaction: { mode: 'nearest', intersect: true }, // opcional, por claridad
                onHover: (e, elements, chart) => {
                    const canvas = e?.native?.target || chart.canvas
                    canvas.style.cursor = elements?.length ? 'pointer' : 'default'
                },
                plugins: {
                    legend: {display: false},
                    tooltip: { enabled: false },
                    datalabels: {
                        color: 'white',
                        font: { size: 10, weight: '400' },
                        display: ctx => {
                        const v = ctx.dataset.data[ctx.dataIndex]
                        return Number(v) > 0      // solo muestra si > 0
                        },
                        formatter: v => v           // o: v => (v ? v : '')
                    }
                }
            }
        })
        
    }else{
        dataBox.style.display = 'none'
        legend.style.display = 'none'
        noData.style.display = 'flex'
    }

    

    loader.style.display = 'none'
    
}

export { printChartDonut }