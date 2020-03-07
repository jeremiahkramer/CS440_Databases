$(document).ready(function() {//JQuery start
    const columnsToSelect = {
        "birth_rate": {
            "dynamic_labels": false,
            "labels": ["Birth Rate"],
            "values": ["birth_rate"]
        },
        "crime": {
            "dynamic_labels": false,
            "labels": [
                "Violent",
                "Murder",
                "Rape",
                "Robbery",
                "Aggravated Assault",
                "Property",
                "Burglary",
                "Larceny",
                "Motor",
                "Arson"
            ],
            "values": [
                "violent",
                "murder",
                "rape",
                "robbery",
                "aggravated_assault",
                "property",
                "burglary",
                "larceny",
                "motor",
                "arson"
            ]

        },
        "education": {
            "dynamic_labels": false,
            "labels": [
                "< HS Diploma",
                "HS Diploma Only",
                "Some College",
                "Bachelors Degree"
            ],
            "values": [
                "less_than_hs_diploma",
                "hs_diploma_only",
                "some_college",
                "bachelors_degree"
            ]
        },
        "elevation": {
            "dynamic_labels": false,
            "labels": [
                "Highest Elevation",
                "Lowest Elevation",
                "AVG Elevation"
            ],
            "values": [
                "highest_elevation",
                "lowest_elevation",
                "average_elevation"
            ]
        },
        "homeless": {
            "dynamic_labels": false,
            "labels": [
                "Number of Homeless"
            ],
            "values": [
                "num_homeless"
            ]
        },
        "income": {
            "dynamic_labels": false,
            "labels": [
                "AVG Salary"
            ],
            "values": [
                "avg_salary"
            ]
        },
        "mental_illness": {
            "dynamic_labels": false,
            "labels": [
                "Mental Illness Cases"
            ],
            "values": [
                "num_diagnosed"
            ]
        },
        "mortality": {
            "dynamic_labels": false,
            "labels": [
                "Number of Deaths"
            ],
            "values": [
                "num_cases"
            ]
        },
        "population": {
            "dynamic_labels": false,
            "labels": [
                "Population Count"
            ], 
            "values": [
                "total_population"
            ]
        },
        "poverty": {
            "dynamic_labels": false,
            "labels": [
                "Poverty Count"
            ],
            "values": [
                "total_poverty"
            ]
        },
        "std": {
            "dynamic_labels": false,
            "labels": [
                "STD count"
            ],
            "values": [
                "num_cases"
            ]
        },
        "unemployment": {
            "dynamic_labels": false,
            "labels": [
                "Unemployment Rate"
            ],
            "values": [
                "unemployment_rate"
            ]
        },
        "voting": {
            "dynamic_labels": true,
            "labels": [
                "party"
            ],
            "values": [
                "party_count"
            ]
        },
        "weather": {
            "dynamic_labels": false,
            "labels": [
                "AVG Temp"
            ],
            "values": [
                "avg_temp"
            ]
        }
    };
    let charts = [];

    //populate div data
    $(".tablename").click(function() {
        if($(".left").attr("data-tablename") === ""){ //populate first input
            $(".left").attr("data-tablename", $(this).text()); //populate its data field with this button's name (table name)
            $(".lefttext").text($(this).text()); //then update its name as well
        }
        else if($(".right").attr("data-tablename") === "") { //populate the second input
            $(".right").attr("data-tablename", $(this).text()); //populate its data field with this button's name (table name)
            $(".righttext").text($(this).text()); //then update its name as well
        }
    });

    //clear input upon x click
    $(".x").click(function() {
        $(this).parent().children(".xytext").text(""); //check sibling with the xytext class (p tag)
        $(this).parent().attr("data-tablename", "");
    });

    $(".graph").click(function() {
        let l = $(".left").children(".lefttext").text();
        let r = $(".right").children(".righttext").text();
        // hardcoded
        let s = "OR";
        if(!l || !r){
            alert("You must select two tables before continuing!");
            return;
        }
        var xhr = new XMLHttpRequest();
        let data = {
            left: l,
            right: r,
            state: s
        };
        var jsonData = JSON.stringify(data);
        console.log(jsonData);
        xhr.open("post", "/", true);
        xhr.setRequestHeader('Content-type','application/json');
        xhr.send(jsonData);
        //recieve the data
        xhr.onload = function(){
            let res = JSON.parse(xhr.response);
            console.log(res);
        };
    });

    $('#select-states').click((e) => {
        let selected = $('#select-states').val();

        // If the user selects all states, then we don't want them to select others as well
        if ((selected.length > 0 && selected[0] === 'All States') || (e.target.textContent === 'All States')) {
            $('#select-states').val(['All States']);
        }
    });

    $('#plot-btn').click(() => {
        let statesSelected = $('#select-states').val();
        
        if (statesSelected.length > 0 && statesSelected[0] === 'All States') {
            statesSelected = [];
        }

        const xhr = new XMLHttpRequest();
        const req = {
            'states': statesSelected
        };

        xhr.open('POST', '/query', true);
        xhr.setRequestHeader('Content-type', 'application/json');
        console.log(req);
        xhr.send(JSON.stringify(req));

        xhr.onload = () => {
            const data = JSON.parse(xhr.response);
       
            let i = 0;
            for (let chart of Object.keys(data)) {
                if (data.hasOwnProperty(chart)) {
                    if (columnsToSelect.hasOwnProperty(chart)) {
                        let datasets = [];
                        if (columnsToSelect[chart].dynamic_labels) {

                            datasets = data[chart].map(item => {
                                return {
                                    label: item[columnsToSelect[chart].labels[0]],
                                    data: [item[columnsToSelect[chart].values[0]]],
                                    backgroundColor: randomColor()
                                }
                            });
                        } else {
                            for (let i = 0; i < columnsToSelect[chart].labels.length; i++) {
                                datasets.push({
                                    label: columnsToSelect[chart].labels[i],
                                    data: data[chart].map(state => state[columnsToSelect[chart].values[i]]),
                                    backgroundColor: randomColor()
                                });
                            }
                        }
                        const stacked = datasets.length > 1;
                        let states = statesSelected;
                        if (statesSelected.length === 0) {
                            states = data[chart].map(item => item.state);
                        }
                        if (charts.length > i) {
                            charts[i] = generateChart(charts[i], chart + '-chart', chart, datasets, stacked, states);
                        } else {
                            charts.push(generateChart(null, chart + '-chart', chart, datasets, stacked, states));
                        }
                        i += 1;
                    }
                }
            }         
        }
    });

    function relClick(){
        var xhr = new XMLHttpRequest();
        var newData = data;
        newData['relevant'] = 1;
        var jsonData = JSON.stringify(newData);
        xhr.open("POST","/",true);
        xhr.setRequestHeader('Content-type','application/json');
        xhr.send(jsonData);
        console.log("Clicked Relevant");


        xhr = new XMLHttpRequest();
        xhr.open("GET","/newtweet",true);
        xhr.send();
        xhr.onload = function(){
            var check = JSON.parse(xhr.response);
            data = (check['ndata'][0]);
            newItem(data,check['rc'],check['ic'],check['mc']);
        };
    }

    function randomColor() {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";    
    }

    function generateChart(chartRef, htmlID, chartInternalName, datasets, stacked, states) {
        const ctx = $(`#${htmlID}`);
        ctx.show();
        if (!chartRef) {
            console.log("Chart is null");
            return new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: states,
                    datasets: datasets
                },
                options: {
                    scales: {
                        yAxes: [{
                            stacked: stacked,
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        xAxes: [{
                            stacked: stacked
                        }]
                    },
                    responsive: false
                }
            });
        } else {
            console.log("Chart is not null")
            chartRef.data.labels = states;
            chartRef.data.datasets = datasets;
            chartRef.options = {
                scales: {
                    yAxes: [{
                        stacked: stacked,
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{
                        stacked: stacked
                    }]
                },
                responsive: false
            }
            chartRef.update();
        }
    }
    //Interactive Map Javascript
    $('#map').usmap({

    //click action
    click: function(event, data) {
        $('#clicked-state').text('Selected State: '+data.name);
        $('#clicked-state').effect('highlight', {color: '#C7F464'}, 2000);
        getstatedata(data.name);
    }

    });

    function getstatedata(state_abbrev){

        var xhr = new XMLHttpRequest();
        let data = {
            state : state_abbrev
        };
        var jsonData = JSON.stringify(data);
        // console.log(jsonData);
        xhr.open("post", "/stateinfo", true);
        xhr.setRequestHeader('Content-type','application/json');
        xhr.send(jsonData);
        //recieve the data
        xhr.onload = function(){
            let res = JSON.parse(xhr.response);
            console.log(res);
        };
    }
});//JQuery end
