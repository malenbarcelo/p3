let g = {
    vehicles:[],
    events:[],
    popups: [vvpp,edpp],
    sidePopups: [edpp],
    // main table
    pages: 0,
    filters: {
        size:15,
        page:1,
        vehicle_code:'',
        id_companies:'',
        order: '[["vehicle_code","ASC"]]'
    },
    // edpp table
    edppPages: 0,
    edppFilters: {
        size:16,
        page:1,
        id_vehicles:'',
        date_from:'',
        date_until:'',
        duration_min:'',
        duration_max:'',
        order: '[["start_timestamp","DESC"]]'
    },
    // main scroll
    loadedPages: new Set(),
    previousScrollTop:0,
    //edpp scroll
    edppLoadedPages: new Set(),
    edppPreviousScrollTop:0,
    // main table tooltips
    tooltips: [
        {
            icon:vdppIcon,
            right:'23%',
        }
    ],
    // edpp tooltips
    edppTooltips: [
        {
            icon:viewIcon,
            right:'26.5%',
        },
        {
            icon:downloadIcon,
            right:'21%',
        },
    ]
}

export default g