// get company color from CSS
const rootStyles = getComputedStyle(document.documentElement)
const color1 = rootStyles.getPropertyValue('--color1').trim()

// convert hex to rgba
function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

let g = {
    currentDate:{},
    weeksEvents:[],
    weeksEventsSelectedIndex:0,
    daysEvents: [],
    weekEvents: [],
    monthsEvents:[],
    monthEvents:[],
    durationAvgMonth:[],
    durationAvgWeek:[],
    popups: [],
    graterThan: 9,
    lessThan:5,
    monthsToGet:2,
    color1: color1,
    color1Full: hexToRgba(color1, 1),
    color1Medium: hexToRgba(color1, 0.65),
    color1Light: hexToRgba(color1, 0.35),
    color1Soft: hexToRgba(color1, 0.3),
    color1Hover: hexToRgba(color1, 0.6),
    graterThanColor: hexToRgba(color1, 1),
    betweenColor: hexToRgba(color1, 0.65),
    lessThanColor: hexToRgba(color1, 0.35),
    
}

export default g