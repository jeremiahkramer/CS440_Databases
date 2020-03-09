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
                "Adhd", 
                "Anxiety_disorder", 
                "Bipolar", 
                "Depression", 
                "Eating_disorder", 
                "Ocd", 
                "Schizophrenia", 
                "Other"
            ],
            "values": [
                "adhd", 
                "anxiety_disorder", 
                "bipolar", 
                "depression", 
                "eating_disorder", 
                "ocd", 
                "schizophrenia", 
                "other"
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
            "dynamic_labels": false,
            "labels": [
                "Republicans",
                "Democrats",
                "Greens",
                "Constitutions",
                "Independents",
                "Libertarians",
                "Others"
            ],
            "values": [
                "republicans",
                "democrats",
                "greens",
                "constitutions",
                "independents",
                "libertarians",
                "others"
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
        xhr.open("post", "/", true);
        xhr.setRequestHeader('Content-type','application/json');
        xhr.send(jsonData);
        //recieve the data
        xhr.onload = function(){
            let res = JSON.parse(xhr.response);
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
        $('#plot-loader').show();

        if (statesSelected.length > 0 && statesSelected[0] === 'All States') {
            statesSelected = [];
        }
        const xhr = new XMLHttpRequest();
        const req = {
            'states': statesSelected
        };

        xhr.open('POST', '/query', true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify(req));
        xhr.onload = () => {
            $('#plot-loader').hide();

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
        ctx.prev().show();
        if (!chartRef) {
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
            return chartRef;
        }
    }
    //Interactive Map Javascript
    $('#map').usmap({

    //click action
    click: function(event, data) {
        let stateSelected = state_switch[data.name];
        var cache = $('#clicked-state').children();
        $('#clicked-state').text('Selected State: '+stateSelected).append(cache);
        getstatedata(data.name);
    }

    });

var state_switch = {AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia', HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan', MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming'};

    function getstatedata(state_abbrev){
        $('#birth_rate').empty();
          $('#unemployment_rate').empty();
          $('#elevation').empty();
          $('#income').empty();
          $('#homeless').empty();
          $('#population').empty();
          $('#mental').empty();
          $('#mortality').empty();
          $('#poverty').empty();
          $('#std').empty();
          $('#weather').empty();
      $('#state-loader').show();

      let statesSelected = state_switch[state_abbrev];
      const xhr = new XMLHttpRequest();
      const req = {
          'states': [statesSelected]
      };
      const view_data = {}
      xhr.open('POST', '/query', true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(JSON.stringify(req));
      xhr.onload = () => {
          $('#state-loader').hide();
          const data = JSON.parse(xhr.response);
          view_data["BR"] = data['birth_rate'].length > 0 ? data['birth_rate'][0]['birth_rate'] : null;
          view_data["UR"] = data['unemployment'].length > 0 ? data['unemployment'][0]['unemployment_rate'] : null;
          view_data["AE"] = data['elevation'].length > 0 ? data['elevation'][0]['average_elevation'] : null;
          view_data["AS"] = data['income'].length > 0 ? data['income'][0]['avg_salary'] : null;
          view_data["NH"] = data['homeless'].length > 0 ? data['homeless'][0]['num_homeless'] : null;
          view_data["PO"] = data['population'].length > 0 ? data['population'][0]['total_population'] : null;
          view_data["MI"] = data['mental_illness'].length > 0 ? data['mental_illness'][0]['num_diagnosed'] : null;
          view_data["ND"] = data['mortality'].length > 0 ? data['mortality'][0]['num_cases'] : null;
          view_data["PC"] = data['poverty'].length > 0 ? data['poverty'][0]['total_poverty'] : null;
          view_data["STD"] = data['std'].length > 0 ? data['std'][0]['num_cases'] : null;
          view_data["AT"] = data['weather'].length > 0 ? data['weather'][0]['avg_temp'] : null;
          
          // $('#state-info').text('Birth Rate: '+view_data["BR"].toFixed(2) +'\n Unemployment Rate: '+view_data["UR"].toFixed(2) + '\n Average Elevation: '+view_data["AE"] + '\n Average Salary: '+view_data["AS"].toFixed(2)+ '\n Number of Homeless: '+view_data["NH"]+'\n Population: '+view_data["PO"].toFixed(2)+ '\n Mental Illness: '+view_data["MI"]+'\n Mortality: '+view_data["ND"]+"\n Poverty: "+view_data["PC"]+'\n STD: '+view_data["STD"]+'\n Average Temperature: '+view_data["AT"].toFixed(2));
          $('#birth_rate').text('Birth Rate: '+(view_data["BR"] ? view_data["BR"].toFixed(2) : ''));
          $('#unemployment_rate').text('Unemployment Rate: ' + (view_data["UR"] ? view_data["UR"].toFixed(2) : ''));
          $('#elevation').text('Average Elevation: '+(view_data["AE"] ? view_data["AE"] : ''));
          $('#income').text('Average Salary: '+(view_data["AS"] ? view_data["AS"].toFixed(2) : ''));
          $('#homeless').text('Number of Homeless: '+(view_data["NH"] ? view_data["NH"] : ''));
          $('#population').text('Population: '+(view_data["PO"] ? view_data["PO"].toFixed(0) : ''));
          $('#mental').text('Mental Illness: '+(view_data["MI"] ? view_data["MI"] : ''));
          $('#mortality').text('Mortality: '+(view_data["ND"] ? view_data["ND"] : ''));
          $('#poverty').text('Poverty: '+(view_data["PC"] ? view_data["PC"] : ''));
          $('#std').text('STD: '+(view_data["STD"] ? view_data["STD"] : ''));
          $('#weather').text('Average Temperature: '+(view_data["AT"] ? view_data["AT"].toFixed(2) : ''));
        }

    }
});//JQuery end
