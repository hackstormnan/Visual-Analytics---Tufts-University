// Color maps you can use: https://colorbrewer2.org/

// Set the dimensions and margins of the graph. You don't need to change this.
const margin = {top: 30, right: 30, bottom: 70, left: 60},
width = 500 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;


/* SVG_SCATTER WILL REPRESENT THE CANVAS THAT YOUR SCATTERPLOT WILL BE DRAWN ON */
// Append the svg object to the body of the page. You don't need to change this.
const svg_scatter = d3.select("#my_scatterplot")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

/* SVG_BAR WILL REPRESENT THE CANVAS THAT YOUR BARCHART WILL BE DRAWN ON */
// Append the svg object to the body of the page. You don't need to change this.
const svg_bar = d3.select("#my_barchart")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(${margin.left},${margin.top})`);

// Read the iris dataset
d3.csv("/iris.csv").then(function(data){

    /****************************************   
     TO DO: Complete the scatter plot tasks
    *****************************************/

    // TO DO: Create a scale for the x-axis that maps the x axis domain to the range of the canvas width
    // Hint: You can create variables to represent the min and max of the x-axis values
        
    // TO DO: Fix these
    var sepal_length_min = d3.min(data, function(d) {return d["sepal.length"]});
    var sepal_length_max = d3.max(data, function(d) {return d["sepal.length"]});
        
    

    // TO DO: Implement the x-scale domain and range for the x-axis
    var xScale_scatter = d3.scaleLinear()
                            .domain([Math.floor(sepal_length_min), Math.ceil(sepal_length_max)])
                            .range([0, width])

    // TO DO: Append the scaled x-axis tick marks to the svg
    svg_scatter.append("g")
        .attr("class", "xAxis")
        .style("font", "11px monaco")
        .attr("transform", `translate(0, ${height})`)
        // TO DO: Explain the following line of code in a comment
        // This is to create the x-axis with the set domain and range.
        .call(d3.axisBottom(xScale_scatter))

    // TO DO: Create a scale for the y-axis that maps the y axis domain to the range of the canvas height
    // Hint: You can create variables to represent the min and max of the y-axis values
    // TO DO: Fix these
    var petal_length_min = d3.min(data, function(d) {return d["petal.length"]});
    var petal_length_max = d3.max(data, function(d) {return d["petal.length"]});


    var yScale_scatter = d3.scaleLinear()
                        .domain([Math.floor(petal_length_min)-0.5, Math.ceil(petal_length_max)])
                        .range([height, 0])

    // TO DO: Append the scaled y-axis tick marks to the svg
    svg_scatter.append("g")
            .attr("class", "yAxis")
            .style("font", "11px monaco")
            .call(d3.axisLeft(yScale_scatter))


    // TO DO: X axis label
    svg_scatter.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 40) // Increase the y-coordinate to move the label below the x-axis
        .text("Sepal Length"); // Set the text content of the element

        
    // TO DO: Y axis label
    svg_scatter.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("x", -margin.left)
        .attr("y", -40) // Decrease the y-coordinate to move the label up
        .text("Petal Length"); // Set the text content of the element

    // TO DO: Chart title
    svg_scatter.append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 16 - 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Petal Length vs. Sepal Length");


    // Create a group element for the grid lines
    var grid = svg_scatter.append("g")
        .attr("class", "grid");

    // Add vertical grid lines
    grid.selectAll(".vertical")
        .data(xScale_scatter.ticks())
        .enter()
        .append("line")
        .attr("class", "vertical")
        .attr("x1", function(d) { return xScale_scatter(d); })
        .attr("x2", function(d) { return xScale_scatter(d); })
        .attr("y1", 0)
        .attr("y2", height)
        .style("stroke", "#ddd")

    // Add horizontal grid lines
    grid.selectAll(".horizontal")
        .data(yScale_scatter.ticks())
        .enter()
        .append("line")
        .attr("class", "horizontal")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", function(d) { return yScale_scatter(d); })
        .attr("y2", function(d) { return yScale_scatter(d); })
        .style("stroke", "#ddd")


    d3.selectAll(".grid line")
        .style("stroke", "#d3d3d3");

    svg_scatter.selectAll("path")
        .style("stroke", "#c7c7c7")
        .style("stroke-width", "1px")
        .style("fill", "none");

    // Move the grid lines behind the scatter plot dots
    grid.raise();


    // Define a color scale for the different groups
    var colorScale_scatter = d3.scaleOrdinal()
        .domain(["Setosa", "Versicolor", "Virginica"])
        .range(["#2c7fb8", "#9ecae1", "#addd8e"]);


    // TODO: Draw scatter plot dots here
    svg_scatter.append("g")
        .selectAll("dot")
        .data(data)
        .join("circle") // Create a new circle element for each data point
        .attr("cx", function(d) { return xScale_scatter(d["sepal.length"]); }) // Set the x position of the circle
        .attr("cy", function(d) { return yScale_scatter(d["petal.length"]); }) // Set the y position of the circle
        .attr("r", 6) // Set the radius of the circle
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("fill", function(d) {
            // Use an if statement to map each group to a specific color
            if (d["variety"] == "Setosa") {
                return colorScale_scatter("Setosa");
            } else if (d["variety"] == "Versicolor") {
                return colorScale_scatter("Versicolor");
            } else {
                return colorScale_scatter("Virginica");
            }
    });





    /********************************************************************** 
     TO DO: Complete the bar chart tasks

     Note: We provide starter code to compute the average values for each 
     attribute. However, feel free to implement this any way you'd like.
    ***********************************************************************/

    // Create an array that will hold all computed average values 
    var average_data = []
    // Compute all average values for each attribute, except 'variety'
    average_data.push({'sepal.length':d3.mean(data, function(d){return d['sepal.length']})})
    // TO DO (optional): Add the remaining values to your array
    average_data.push({'sepal.width':d3.mean(data, function(d){return d['sepal.width']})})
    average_data.push({'petal.length':d3.mean(data, function(d){return d['petal.length']})})
    average_data.push({'petal.width':d3.mean(data, function(d){return d['petal.width']})})

    // Compute the maximum and minimum values from the average values to use for later
    let max_average = Object.values(average_data[0])[0]
    let min_average = Object.values(average_data[0])[0]
    average_data.forEach(element => {
        max_average = Math.max(max_average, Object.values(element)[0])
        min_average = Math.min(min_average, Object.values(element)[0])
    });


    // Get all attribute names except for 'variety' as x domain
    xDomain = Object.keys(data[0]).filter(function(attribute) {
        return attribute != 'variety';
    });

    // Create a scale band for x axis
    var xScale_bar = d3.scaleBand()
        .domain(xDomain)
        .range([0, width])
        .padding(0.4);


    // TO DO: Finish this
    svg_bar.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale_bar))


    // Create the y-scale using the maximum frequency value
    var yScale_bar = d3.scaleLinear()
        .domain([0, Math.ceil(max_average)])
        .range([height, 0]);


    svg_bar.append("g")
    .attr("class", "yAxis")
    .call(d3.axisLeft(yScale_bar))
    .append("text")
    .attr("class", "axis-label")
    .attr("y", -50) // Move the axis label up
    .attr("x", -height/2) // Move the axis label to the left
    .attr("transform", "rotate(-90)") // Rotate the axis label
    .attr("text-anchor", "middle")
    .text("Average Value");


    // Add vertical grid lines
    svg_bar.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale_bar).tickSize(-height).tickFormat(""))


    // Add horizontal grid lines
    svg_bar.append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(yScale_bar).tickSize(-width).tickFormat(""))


    d3.selectAll(".grid line")
        .style("stroke", "#d3d3d3");

    svg_bar.selectAll("path")
        .style("stroke", "#c7c7c7")
        .style("stroke-width", "1px")
        .style("fill", "none");


    var colorScale = d3.scaleSequential()
        .domain([min_average, max_average])
        .interpolator(d3.interpolateBlues);


    svg_bar.selectAll(".bar")
        .data(average_data)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return xScale_bar(Object.keys(d)[0]); })
            .attr("y", function(d) { return yScale_bar(Object.values(d)[0]); })
            .attr("width", xScale_bar.bandwidth())
            .attr("height", function(d) { return height - yScale_bar(Object.values(d)[0]); })
            .style("stroke", "black")
            .style("stroke-width", 1)
            .style("fill", function(d) { return colorScale(Object.values(d)[0]); }); // Use the color scale to set the bar color
            
    // Add x-axis label
    svg_bar.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2 + 140)
        .attr("y", height + margin.bottom - 25)
        .text("Attribute");

    // Add y-axis label
    svg_bar.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "middle")
        .attr("x", -height / 2 + 150)
        .attr("y", -margin.left + 20)
        .attr("transform", "rotate(-90)")
        .text("Average");

    svg_bar.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2) - 3)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Average Values Per Attribute");
})
