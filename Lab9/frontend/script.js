var minX, maxX, minY, maxY, minTemp, maxTemp, minHumidity, maxHumidity, minWind, maxWind;
var xScale, yScale, svg, sliderHumidity, sliderTemp, sliderWind;
var svgWidth, svgHeight;
var days = [], months = [];

var lowTemp, hiTemp, lowHumidity, hiHumidity, lowWind, hiWind;

function httpPostAsync(url, data, callback) {
    // console.log(data)
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 201){
        callback(xmlHttp.responseText);
      }
    }
    xmlHttp.open("POST", url, true); // true for asynchronous
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.send(data)
}

// the following function gets a sql query, sends it to backend 
var executeQuery = function(queryString, functionCB) {
    httpPostAsync("http://localhost:6969/sqlquery", 
            JSON.stringify(queryString),
            functionCB)

}

// TODO: constructSQL
/*
Contract: constructSQL modifies the 'sqlString' variable to send the appropriate SQL query
            to the server. sqlString should specify the inputs for lowHumidity, hiHumidity,
            lowTemp, hiHTemp, lowWind, hiWind, days, and months.
*/
var constructSQL = function () {
    console.log("construct query");

    var sqlString = "SELECT * FROM forestfire WHERE ";

    // Add conditions for low and high humidity
    sqlString += "humidity >= " + lowHumidity + " AND humidity <= " + hiHumidity;

    // Add conditions for low and high temperature
    sqlString += " AND temp >= " + lowTemp + " AND temp <= " + hiTemp;

    // Add conditions for low and high wind
    sqlString += " AND wind >= " + lowWind + " AND wind <= " + hiWind;

    // Add conditions for days and months
    var daysString = "";
    for (var i = 0; i < days.length; i++) {
        daysString += days[i];
        if (i < days.length - 1) {
            daysString += ",";
        }
    }
    sqlString += " AND day IN (" + daysString + ")";

    var monthsString = "";
    for (var j = 0; j < months.length; j++) {
        monthsString += months[j];
        if (j < months.length - 1) {
            monthsString += ",";
        }
    }
    sqlString += " AND month IN (" + monthsString + ")";

    // The following line will print the SQL query to the html page
    document.getElementById('sql').innerHTML = sqlString.toString();

    return sqlString;
}

var dataset;

// This is where the scatterplot gets drawn
var draw = function () {
    // Since the query updates our SVG, we need to remove any existing SVGs during redraw
    svg.selectAll("circle").remove();
    svg.selectAll("g.axis").remove();

    var tooltip = d3.select("#viz").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    var tipMouseover = function(event, d) {
    var item = d;
    var html  = "<b>ID:</b> " + item.id +
                "<br/><b>Month:</b> " + item.month +
                "<br/><b>Day:</b> " + item.day +
                "<br/><b>Temp:</b> " + item.temp +
                "<br/><b>Humidity:</b> " + item.humidity +
                "<br/><b>Wind:</b> " + item.wind;

    tooltip.html(html)
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 28) + "px")
        .transition()
        .duration(200)
        .style("opacity", .9)
    };

    var tipMouseout = function(d) {
        tooltip.transition()
        .duration(300)
        .style("opacity", 0);
    };

    //drawing the x and y axes
    xAxis = d3.axisTop()
    .scale(xScale)
    .ticks(5);

    yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(5);

    svg.append("g")
        .attr("class", "axis")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", svgWidth+20)
        .attr("y", -25)
        .style("text-anchor", "end")
        .text("x-location");

    svg.append("g")
        .attr("class", "axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", -svgWidth+40)
        .attr("y", -30)
        .style("text-anchor", "end")
        .text("y-location");


    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
        return xScale(d.X);
        })
        .attr("cy", function(d) {
        return yScale(d.Y);
        })
        .attr("r", 4.5)
    .attr("fill", "FireBrick")
    .attr("stroke-width", 1)
    .attr("stroke", "black")
    .on("mouseover", tipMouseover)
    .on("mouseout", tipMouseout);
}

var myFunction = function(resultSet) {  
    resultSet = JSON.parse(resultSet)
    console.log(resultSet)
    dataset = resultSet;
    draw();
}

var visSetup = function () {
    var margin = {top: 45, right: 30, bottom: 30, left: 45},
    width = 360 - margin.left - margin.right,
    height = 360 - margin.top - margin.bottom;

    svgWidth = width;
    svgHeight = height;

    xScale = d3.scaleLinear()
            .domain([0, maxX])
            .range([0, width]);

    yScale = d3.scaleLinear()
            .domain([0, maxY])
            .range([0, height]);

    svg = d3.select("#viz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("background-color", "#dbdad7")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        sliderHumidity = document.getElementById('sliderHumidity');

        noUiSlider.create(sliderHumidity, {
        start: [0, 100],
        connect: false,
            tooltips: true,
        step: 1,
        range: {
                    'min': parseInt(minHumidity),
                    'max': parseInt(maxHumidity)
                }
        });

        sliderHumidity.noUiSlider.on('change', function(){
            var values = sliderHumidity.noUiSlider.get();
            lowHumidity = values[0];
            hiHumidity = values[1];
            executeQuery (constructSQL(), myFunction);
        });

        sliderTemp = document.getElementById('sliderTemp');

        noUiSlider.create(sliderTemp, {
        start: [0, 100],
        connect: false,
        tooltips: true,
        step: 1,
        range: {
                    'min': parseInt(minTemp),
                    'max': parseInt(maxTemp)
                }
        });

        sliderTemp.noUiSlider.on('change', function(){
            var values = sliderTemp.noUiSlider.get();
            lowTemp = values[0];
            hiTemp = values[1];
            executeQuery (constructSQL(), myFunction);
        });


        sliderWind = document.getElementById('sliderWind');

        noUiSlider.create(sliderWind, {
        start: [0, 100],
        connect: false,
        tooltips: true,
        step: 1,
        range: {
                    'min': parseInt(minWind),
                    'max': parseInt(maxWind)
                }
        });

        sliderWind.noUiSlider.on('change', function(){
            var values = sliderWind.noUiSlider.get();
            lowWind = values[0];
            hiWind = values[1];
            executeQuery (constructSQL(), myFunction);
        });

        d3.selectAll(".checkboxDays").each(function(d){
        var cbdays = d3.select(this);
        var day = cbdays.property("value")
        days.push(day);
        });

        d3.selectAll(".checkboxMonths").each(function(d){
        var cbmonths = d3.select(this);
        var month = cbmonths.property("value")
        months.push(month);
        });

        d3.selectAll(".checkboxDays").on("change", function(){
        var cbdays = d3.select(this);
        var day = cbdays.property("value")

        if(cbdays.property("checked")){
            days.push(day);
            executeQuery (constructSQL(), myFunction);
        }
        else{
            var index = days.indexOf(day);
            console.log(index);
            if (index > -1) {
            days.splice(index, 1);
            executeQuery (constructSQL(), myFunction);
            }
        }
        });

        d3.selectAll(".checkboxMonths").on("change", function(){
            var cbmonths = d3.select(this);
            var month = cbmonths.property("value")

            if(cbmonths.property("checked")){
                months.push(month);
                executeQuery (constructSQL(), myFunction);
            }
            else{
                var index = months.indexOf(month);
                console.log(index);
                if (index > -1) {
                months.splice(index, 1);
                executeQuery (constructSQL(), myFunction);
                }
            }
        });
}

// TODO: Correctly assign values from resultSetRow to the given variables


function getMinMax(resultSetRow) {
    resultSetRow = JSON.parse(resultSetRow)

    minX = 100;
    maxX = 0;
    minY = 100;
    maxY = 0;
    minTemp = 100;
    maxTemp = 0;
    minHumidity = 100;
    maxHumidity = 0;
    minWind = 100;
    maxWind = 0;

    for (var i = 1; i < resultSetRow.length; i++) {
        var x_val = parseFloat(resultSetRow[i]['X']);
        if (x_val < minX) {
            minX = x_val;
        }
        if (x_val > maxX) {
            maxX = x_val;
        }

        var y_val = parseFloat(resultSetRow[i]['Y']);
        if (y_val < minY) {
            minY = y_val;
        }
        if (y_val > maxY) {
            maxY = y_val;
        }

        var temp_val = parseFloat(resultSetRow[i]['temp']);
        if (temp_val < minTemp) {
            minTemp = temp_val;
        }
        if (temp_val > maxTemp) {
            maxTemp = temp_val;
        }

        var humidity_val = parseFloat(resultSetRow[i]['humidity']);
        if (humidity_val < minHumidity) {
            minHumidity = humidity_val;
        }
        if (humidity_val > maxHumidity) {
            maxHumidity = humidity_val;
        }

        var wind_val = parseFloat(resultSetRow[i]['wind']);
        if (wind_val < minWind) {
            minWind = wind_val;
        }
        if (wind_val > maxWind) {
            maxWind = wind_val;
        }
    }


    lowTemp = minTemp;
    hiTemp = maxTemp;
    lowHumidity = minHumidity;
    hiHumidity = maxHumidity;
    lowWind = minWind;
    hiWind = maxWind;


    visSetup();
    console.log("complete getminmax");
    executeQuery(constructSQL(), myFunction);
}

/* TO DO: Correctly call a SQL query to assign min and max values from columns in forestfire. */

var queryTemplate = "SELECT * FROM forestfire"

console.log("queryTemplate: " + queryTemplate)
executeQuery(queryTemplate, getMinMax)
console.log("here");



