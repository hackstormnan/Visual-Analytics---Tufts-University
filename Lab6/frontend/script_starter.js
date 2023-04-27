/* Server Connection Section */
// initilize xhr
var xhr = null;

// connect to server and get callback
function connectServer() {
    console.log("Get users...");
    if (!xhr) {
        // Create a new XMLHttpRequest object 
        xhr = new XMLHttpRequest();
    }
    xhr.onreadystatechange = dataCallback;

    // asynchronous requests
    xhr.open("GET", "http://localhost:6969/confusionMatrix", true);

    // Send the request to the server, this is needed even if nothing is sent in this case
    xhr.send(null);
}

function dataCallback() {
    // Check response is ready or not
    if (xhr.readyState == 4 && xhr.status == 200) {
        console.log("User data received!");
        // get response data
        predictionData = JSON.parse(xhr.responseText)[0]
        happinessData = JSON.parse(xhr.responseText)[1]
        confusionMatrix = JSON.parse(xhr.responseText)[2]
        // draw scatterplot and confusion matrix
        draw_scatterplots(happinessData, predictionData, confusionMatrix)
    }
}


/* Draw Scatter Plot */
// Defining size variables for the SVGs
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    miniWidth = 230 - margin.left - margin.right,
    miniHeight = 150 - margin.top - margin.bottom;

function draw_scatterplots(happinessData, predictionData, confusionMatrix) {
    // TODO: Print data

    // Choose the initial dimensions that we are rendering
    var possibleDimensions = Object.keys(happinessData[Object.keys(happinessData)[0]])
    var xDim = possibleDimensions[0];
    var yDim = possibleDimensions[1];

    // Initialize the scales and axes
    var xScale = d3.scaleLinear().range([0, width]).domain([-0.5, 5.5])
    var xAxis = d3.axisBottom(xScale).ticks(5)
    var miniXScale = d3.scaleLinear().range([0, miniWidth]).domain([-0.5, 5.5])
    var miniXAxis = d3.axisBottom(miniXScale).ticks(5)
    
    var yScale = d3.scaleLinear().range([height, 0]).domain([-0.5, 5.5])
    var yAxis = d3.axisRight(yScale).ticks(5)
    var miniYScale = d3.scaleLinear().range([miniHeight, 0]).domain([-0.5, 5.5])
    var miniYAxis = d3.axisRight(miniYScale).ticks(5);

    // Fill in the possible dimensions into the select lists
    initializeScales()

    // Initialize each model container
    var modelContainers = initializeModels();

    // draw scatter plot in model containers
    redrawScatterplots(modelContainers);

    // draw confusion model in model containers
    drawConfusionMatrices(modelContainers);

    /////////////////////////////////////////////////////
    /* Supporting Functions */
    /////////////////////////////////////////////////////

    /* SCATTERPLOT CODE - YOU WILL NEED TO CHANGE THIS */
    function buildScatterPlot(containerElement, data, modelPredictions, groundTruth) {
        var svgWidth, svgHeight, scatterXScale, scatterXAxis, scatterYScale, scatterYAxis;
        if (modelPredictions.length === 0) {
            // scatter plot is for the whole dataset
            svgWidth = width;
            svgHeight = height;
            scatterXScale = xScale;
            scatterXAxis = xAxis;
            scatterYScale = yScale;
            scatterYAxis = yAxis;
        } else {
            // scatter plot is for a particular model
            svgWidth = miniWidth;
            svgHeight = miniHeight;
            scatterXScale = miniXScale;
            scatterXAxis = miniXAxis;
            scatterYScale = miniYScale;
            scatterYAxis = miniYAxis;
        }

        // We destroy any existing SVGs since we're going to rebuild it.
        d3.select(containerElement).select('svg').remove()

        // Add the svg
        svg = d3.select(containerElement)
            .append('svg')

        svg.attr("width", svgWidth + margin.left + margin.right)
            .attr("height", svgHeight + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Add the axes
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + svgHeight + ")")
            .call(scatterXAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", svgWidth)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text(xDim);

        // y-axis
        svg.append("g")
            .attr("class", "y axis")
            .call(scatterYAxis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 18)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(yDim);
        
        

        // TODO: determine the dot style
        function determineDotShape(d){
            /*
            curModel = containerElement.replace('#', '')
            if(curModel == 'dataset-svg'){
                // key = Object.keys(groundTruth)[d.id - 1]
                key = d.id
                if(groundTruth[key] == 1){
                    return d3.symbol().type(d3.symbolCross)()
                }
                return d3.symbol().type(d3.symbolCircle)()
            }
            */
            
            // key = Object.keys(modelPredictions)[d.id - 1]
            // console.log(d.id)

            key = d.id
            if(groundTruth[key] == 1){
                return d3.symbol().type(d3.symbolCross)()
            }
            return d3.symbol().type(d3.symbolCircle)()
        }

        // TODO: determine the storke color
        function determineStrokeColor(d) {
            curModel = containerElement.replace('#', '')
            if(curModel == 'dataset-svg'){
                return 'black'
            }

            key = d.id
            if(modelPredictions[key] == groundTruth[key]){
                return 'green'
            }
            return 'red'
        }

        // draw dots into the scatterplot
        svg.selectAll(".dot")
            .data(data)
            .enter().append("path")
                .attr("class", "dot")
                .attr("r", 2.5)
                .attr('fill', 'none')
                .attr('d', determineDotShape)
                .attr('stroke', determineStrokeColor)
                .attr('transform', (d) => 'translate(' + scatterXScale(d.x) + ', ' + scatterYScale(d.y) + ')')
    }
    /* END SCATTERPLOT CODE */

    /* CONFUSION MATRIX CODE - YOU WILL NEED TO CHANGE THIS */
    function buildConfusionMatrix(containerElement, confusionMatrix) {
        // console.log(confusionMatrix)
        // Code below makes the confusion matrix
        var table = d3.select(containerElement).append('table')
                        .attr('class', 'confusion-matrix-table')

        // Creating the other cells of the table
        table.append('tr').html('<td/><td/><td>ground</td><td>truth</td>')
        table.append('tr').html('<td/><td/><td>T</td><td>N</td>')
        predictedTrueRow = table.append('tr').html('<td>Predicted</td><td>T</td>')
        predictedFalseRow = table.append('tr').html('<td></td><td>N</td>')

        // TODO: filling in the values
        var truePositives = confusionMatrix['truePositive'];
        var trueNegatives = confusionMatrix['trueNegative'];
        var falsePositives = confusionMatrix['falsePositive'];
        var falseNegatives = confusionMatrix['falseNegative'];

        predictedTrueRow.append('td')
                        .attr('class', 'innerMatrix')
                        .text(truePositives)

        predictedTrueRow.append('td')
                        .attr('class', 'innerMatrix')
                        .text(falsePositives)

        predictedFalseRow.append('td')
                        .attr('class', 'innerMatrix')
                        .text(falseNegatives)

        predictedFalseRow.append('td')
                        .attr('class', 'innerMatrix')
                        .text(trueNegatives)
    }
    /* END CONFUSION MATRIX CODE */

    /* BEGIN SUPPORT CODE */
    function initializeScales() {

        // Fill in the possible dimensions into the select lists
        d3.select('#x-axis-select')
            .selectAll('option')
            .data(possibleDimensions)
            .enter()
                .append('option')
                .text((d) => d)
                .attr('value', (d,i) => i)
                .property("selected", function(d){ return d === xDim; })

        d3.select('#y-axis-select')
            .selectAll('option')
            .data(possibleDimensions)
            .enter()
                .append('option')
                .text((d) => d)
                .attr('value', (d,i) => i)
                .property("selected", function(d){ return d === yDim; })

        // TODO: onchange event
        d3.select("#x-axis-select").on("change", function(d) {
            xDim = possibleDimensions[d3.select(this).property("value")]
            redrawScatterplots(modelContainers);
        })

        d3.select("#y-axis-select").on("change", function(d) {
            yDim = possibleDimensions[d3.select(this).property("value")]
            redrawScatterplots(modelContainers);
        })

    }

    function initializeModels() {
        d3.select('.models-container ul')
            .selectAll('li')
            .data(Object.keys(predictionData).filter((k) => k !== 'ground_truth')).enter()
                .append('li')
                .attr('class', 'model-li')
                .attr('id', (d) => d.replace(/ /g,"-"))
                .html((d) => '<h2>' + d + '</h2>')
                    .append('div')
                    .attr('class', 'model-confusion-matrix')
                    .attr('id', (d) => 'model-confusion-matrix-' + d.replace(/ /g,"-"))
        
        return Object.keys(predictionData)
    }

    function parseData(data) {
        // We need to add some random jitter because there are so few points
        epsilon = 0.4
        scatterplotData = Object.keys(data).map((k) => { return {id: parseInt(k), x: data[k][xDim] + ((0.5 - Math.random()) * epsilon), y: data[k][yDim] + ((0.5 - Math.random()) * epsilon)} } )
        return scatterplotData;
    }

    function redrawScatterplots(modelContainers) {
        scatterplotData = parseData(happinessData)
        // Render the data svg
        buildScatterPlot('#dataset-svg', scatterplotData, [], predictionData['ground_truth'])

        modelContainers.forEach((c) => { buildScatterPlot('#' + c.replace(/ /g,"-"), 
                                                        scatterplotData, predictionData[c], 
                                                        predictionData['ground_truth']) } );
    }

    function drawConfusionMatrices(modelContainers) {
        modelContainers.forEach((c) => { buildConfusionMatrix('#model-confusion-matrix-' + c.replace(/ /g,"-"), confusionMatrix[c]) });
    }
}