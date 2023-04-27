
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

// *NEW*: Canvas for the scatterplot legend
// You can change properties of the SVG if you'd like, but it's not necessary
const svg_scatter_legend = d3.select("#scatterplot_legend")
                .append("svg")
                .attr("width", 500)
                .attr("height", 50)
                .append("g")
                .attr("transform", `translate(${margin.left + 55},${margin.top - 10})`);

/* SVG_BAR WILL REPRESENT THE CANVAS THAT YOUR BARCHART WILL BE DRAWN ON */
// Append the svg object to the body of the page. You don't need to change this.
const svg_bar = d3.select("#my_barchart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

// *NEW*: Canvas for the barchart legend
// You can change properties of the SVG if you'd like, but it's not necessary
const svg_bar_legend = d3.select("#barchart_legend")
                .append("svg")
                .attr("width", 500)
                .attr("height", 50)
                .append("g")
                .attr("transform", `translate(${margin.left + 55},${margin.top - 10})`);


// Read the iris dataset
d3.csv("/iris.csv").then(function(data){

    /**********************************************************  
     TO DO: Complete the scatter plot tasks

     NOTE: Below, we outline "to do" tasks that correspond
     to the tasks in your handout. These to do's are meant
     to help guide you towards a correct solution, however,
     you may implement your code in whichever way you'd like.
    **********************************************************/

    // TO DO: Create a list of options for the axes dropdowns (all numerical attribute)
    var scatterAxesOptions = ["sepal.length", "sepal.width", "petal.length", "petal.width"];

    // add the options to the X-axis dropdown
    // The below code should not need to be changed
    d3.select("#xAxisDropdown")
      .selectAll('option')
     	.data(scatterAxesOptions)
      .enter()
    	.append('option')
      .attr("value", function (d) { return d; }) // corresponding value returned by the button
      .text(function (d) { return d; }) // text showed in the menu
      
    // add the options to the y-axis dropdown
    d3.select("#yAxisDropdown")
      .selectAll('option')
     	.data(scatterAxesOptions)
      .enter()
    	.append('option')
      .attr("value", function (d) { return d; }) // corresponding value returned by the button
      .text(function (d) { return d; }) // text showed in the menu

    var selectedXAxisOption = d3.select("#xAxisDropdown").property("value")
    var selectedYAxisOption = d3.select("#yAxisDropdown").property("value")

    // TO DO: Create a legend for the scatterplot
    // scatter_color_classes is an array of objects, with iris varieties and their colors
    // change this if you used different colors in your scatterplot
    var scatter_color_classes = [{variety: "Versicolor", color:"#a6cee3"} , 
                                 {variety:"Virginica", color:"#b2df8a"}, 
                                 {variety:"Setosa", color:"#1f78b4"}]
    
    // draw the colored dots
    svg_scatter_legend.append("g")
        .selectAll("dot")
        .data(scatter_color_classes)
        .join("circle")
        .attr("cx", function(d, i) { return i * 100 - 40; }) // spread the circles horizontally
        .attr("cy", 15) // align the circles vertically
        .attr("r", 5)
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .style("fill", function(d) { return d.color; });

    // create the legend title
    svg_scatter_legend.append("text")
        .attr("x", 40) // Set x position to the middle of the legend
        .attr("y", -10) // Set y position to the top margin of the legend
        .text("Iris Varieties") // Replace "Legend Title" with your desired title
        .style("font-size", "13px")
        .attr("alignment-baseline","middle")

    // add text labels for the dots in the legend 
    svg_scatter_legend.selectAll("legend.label")
        .data(scatter_color_classes)
        .enter()
        .append("text")
        .attr("x", function(d, i) { return i * 100 - 30; })        
        .attr("y", 15)
        .style("font-size", "12px")
        .attr("alignment-baseline","middle")
        .text(function (d) { return d.variety; });
    
    // Call drawScatter() here to draw the first instance of our plot
    drawScatter();


    /************************************************************************************
        drawScatter(): updates the scatterplot after a dropdown menu item is selected
        Special note: This function needs to wrap around your entire scatter plot code
        and be called after a dropdown menu item is selected. If not, the plot won't
        be updated accordingly, as the scatterplot will otherwise only be drawn once 
    *************************************************************************************/
    // ADD YOUR SCATTERPLOT CODE HERE AND UPDATE IT FOR THE TASKS
    function drawScatter() {
        // THIS LINE CLEARS THE SCATTERPLOT CANVAS, as they are redrawn every time a dropdown is selected 
        // Although this is a bit of a hacky workaround, this line will simplify everything for you down the line. 
        svg_scatter.selectAll('*').remove();

        // TO DO: Compute x-axis min and max using dropdown choice
        // HINT: It may help to do...
        var x_axis_min = d3.min(data, function(d){return d[selectedXAxisOption]});
        var x_axis_max = d3.max(data, function(d){return d[selectedXAxisOption]});


        // TO DO: Compute x-axis scale using the above computed min and max, using your original lab 4 code
        // TO DO: Implement the x-scale domain and range for the x-axis
        var xScale_scatter = d3.scaleLinear()
            .domain([Math.floor(x_axis_min) == x_axis_min ? Math.floor(x_axis_min)-0.5 : Math.floor(x_axis_min), 
                Math.ceil(x_axis_max) == x_axis_max ? Math.ceil(x_axis_max)+0.5 : Math.ceil(x_axis_max)])
            // .domain([x_axis_min-0.5, x_axis_max+0.5])
            .range([0, width])

        // TO DO: Append the scaled x-axis tick marks to the svg
        svg_scatter.append("g")
            .attr("class", "xAxis")
            .style("font", "11px monaco")
            .attr("transform", `translate(0, ${height})`)
            // TO DO: Explain the following line of code in a comment
            // This is to create the x-axis with the set domain and range.
            .call(d3.axisBottom(xScale_scatter))

        // TO DO: Compute y-axis min and max using dropdown choice
        // HINT: It may help to do...
        var y_axis_min = d3.min(data, function(d){return d[selectedYAxisOption]});
        var y_axis_max = d3.max(data, function(d){return d[selectedYAxisOption]});

        var yScale_scatter = d3.scaleLinear()
            .domain([Math.floor(y_axis_min) == y_axis_min ? Math.floor(y_axis_min)-0.5 : Math.floor(y_axis_min), 
                Math.ceil(y_axis_max) == y_axis_max ? Math.ceil(y_axis_max)+0.5 : Math.ceil(y_axis_max)])
            // .domain([y_axis_min-0.5, y_axis_max+0.5])
            .range([height, 0])

        // TO DO: Append the scaled y-axis tick marks to the svg
        svg_scatter.append("g")
                .attr("class", "yAxis")
                .style("font", "11px monaco")
                .call(d3.axisLeft(yScale_scatter))


        // Append some text to scatterplot for the tooltips, the exact text will be added later
        // HINT: We provide this code for you to use below, it does not need to be changed
        svg_scatter.append("text")
            .attr("id", "scatterTooltip")
            .attr("opacity", 0)
            .style("padding", "10px")
            .attr("font-family", "sans-serif")
            .attr("font-size", "16px");


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
            .attr("stroke-dasharray", "2,2")

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
            .attr("stroke-dasharray", "2,2")


        d3.selectAll(".grid line")
            .style("stroke", "#d3d3d3");



        // TO DO: draw your scatter plot
        // HINT: FIX THIS CODE. We provide many hints below.
        svg_scatter.append("g")
            .selectAll("dot")
            .data(data)
            .join("circle")
                // TO DO: Update the data being drawn (x- and y- positions) based on the user's dropdown choices
                .attr("cx", function(d) {return xScale_scatter(d[selectedXAxisOption])}) 
                .attr("cy", function(d) {return yScale_scatter(d[selectedYAxisOption])})
                .attr("r", 6)
                .attr("stroke", "black")
                .attr("stroke-weight", 1)
                .style("fill", function(d) {
                    // Find the corresponding color for this variety
                    var colorObj = scatter_color_classes.find(function(c) { return c.variety == d.variety; });
                    if (colorObj) {
                        return colorObj.color;
                    } else {
                        // If the variety is not in the array, return a default color
                        return "grey";
                    }
                })
            // TO DO: Add functionality for the tooltip mouseover function
            // This function should display the data point's information when being hovered
            .on("mouseover", function(event, d) {
                // TO DO: Change the radius size on hover
                d3.select(this).style("r", 8)
            
                // TO DO: Add and position text to display x-axis values & y-axis label
                svg_scatter.select("#scatterTooltip")
                    .attr("x", 10)
                    .attr("y", 10)
                    .text(selectedXAxisOption + ": " + d[selectedXAxisOption])
                    .attr("opacity", 1);

                // TO DO: Add and position text to display y-axis values & y-axis label
                svg_scatter.select("#scatterTooltip").append("tspan")
                    .attr("x", 10)
                    .attr("y", 30)
                    .text(selectedYAxisOption + ": " + d[selectedYAxisOption]) // This should be '<y-axis label>: <y-axis value>'
                    .attr("opacity", 1);

                var colorObj = scatter_color_classes.find(function(c) { return c.variety == d.variety; });
                // TO DO: Add and position text to display the variety
                svg_scatter.select("#scatterTooltip").append("tspan")
                    .attr("x", 10)
                    .attr("y", 50)
                    .text("Variety: " + colorObj.variety) // This should be 'Variety: <variety value>'
                    .attr("opacity", 1);
            })
            // Code to 'remove' the tooltip information
            .on("mouseleave", function(d) {
                // TO DO: Change the radius size when not hovered
                d3.select(this).style("r", 6)

                // TO DO: remove tooltip when data point not being hovered
                svg_scatter.select("#scatterTooltip")
                    .transition()
                    .duration(150)
                    .attr("opacity", 0) // FIX THIS
            })
            

        // TO DO: Add X axis label based on dropdown choices
        svg_scatter.append("text")
            .attr("class", "xAxisLabel")
            .attr("text-anchor", "end")
            .attr("x", width - 20)
            .attr("y", height + margin.top + 10)
            // Update x-axis label based on dropdown choice
            .text(function (d) { 
                return ""; // FIX THIS
            })
            
        // TO DO: Add Y axis label based on dropdown choices
        svg_scatter.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -margin.top)
            // Update y-axis label based on dropdown choice
            .text(function (d) { 
                return ""; // FIX THIS
            })

        // TO DO: Add chart title based on dropdown choices
        svg_scatter.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2) + 5)
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            // Update chart title label based on dropdown choices
            .text(function (d) { 
                return ""; // FIX THIS
            });



        // TO DO: X axis label
        svg_scatter.append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + 40) // Increase the y-coordinate to move the label below the x-axis
            .text(selectedXAxisOption); // Set the text content of the element

            
        // TO DO: Y axis label
        svg_scatter.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("x", -margin.left)
            .attr("y", -40) // Decrease the y-coordinate to move the label up
            .text(selectedYAxisOption); // Set the text content of the element

        // TO DO: Chart title
        svg_scatter.append("text")
            .attr("x", width / 2)
            .attr("y", margin.top / 16 - 20)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text(selectedYAxisOption + " vs. " + selectedXAxisOption);
    }
  
    // TO DO: Run the appropriate code when the dropdown menu is selected for x-axis choice
    // NOTE: We provide the below code to help you, you do not need to change it.
    d3.select("#xAxisDropdown").on("change", function(d) {
        // console.log("inside xAxisDropdown(), x-axis has been changed to ", d3.select(this).property("value"))

        selectedXAxisOption = d3.select(this).property("value")
        // run the drawScatter function
        drawScatter();
    })

    // Run the appropriate code when the dropdown menu is selected for y-axis choice
    d3.select("#yAxisDropdown").on("change", function(d) {
        selectedYAxisOption = d3.select(this).property("value")
        // run the drawScatter function
        drawScatter();
    })




    // Call drawBarChart("AVG") here to draw the first instance of our plot
    drawBarChart("AVG");


    // ADD BAR CHART CODE HERE AND UPDATE IT FOR THE TASKS
    function drawBarChart(radioValue) {
        // CLEAR THE BAR CHART & LEGEND CANVAS, as they are redrawn every time a radio button is selected 
        svg_bar.selectAll('*').remove();
        svg_bar_legend.selectAll('*').remove();
        var all_y_values = []
        var min_y_value, max_y_value

        var xAxisValues = ['sepal.length', 'sepal.width', 'petal.length', 'petal.width'];
        // Add logic for if the radio button is AVG, MAX, MIN
        // Note that "all_y_values" should be the entire array of corresponding values
        // "min_y_value" should be the minimum value in the array, and max_y_value should be the max value
        if (radioValue === "AVG") {
            
            
            all_y_values.push({'sepal.length':d3.mean(data, function(d){return d['sepal.length']})})
            all_y_values.push({'sepal.width':d3.mean(data, function(d){return d['sepal.width']})})
            all_y_values.push({'petal.length':d3.mean(data, function(d){return d['petal.length']})})
            all_y_values.push({'petal.width':d3.mean(data, function(d){return d['petal.width']})})
            
        
            // Compute the maximum and minimum values from the average values to use for later
            max_y_value = Object.values(all_y_values[0])[0]
            min_y_value = Object.values(all_y_values[0])[0]
            all_y_values.forEach(element => {
                max_y_value = Math.max(max_y_value, Object.values(element)[0])
                min_y_value = Math.min(min_y_value, Object.values(element)[0])
            });
        } else if (radioValue === "MAX") {
            all_y_values.push({'sepal.length':d3.max(data, function(d){return d['sepal.length']})})
            all_y_values.push({'sepal.width':d3.max(data, function(d){return d['sepal.width']})})
            all_y_values.push({'petal.length':d3.max(data, function(d){return d['petal.length']})})
            all_y_values.push({'petal.width':d3.max(data, function(d){return d['petal.width']})})

            // Compute the maximum and minimum values from the average values to use for later
            max_y_value = Object.values(all_y_values[0])[0]
            min_y_value = Object.values(all_y_values[0])[0]
            all_y_values.forEach(element => {
                max_y_value = Math.max(max_y_value, Object.values(element)[0])
                min_y_value = Math.min(min_y_value, Object.values(element)[0])
            });
        } else {
            all_y_values.push({'sepal.length':d3.min(data, function(d){return d['sepal.length']})})
            all_y_values.push({'sepal.width':d3.min(data, function(d){return d['sepal.width']})})
            all_y_values.push({'petal.length':d3.min(data, function(d){return d['petal.length']})})
            all_y_values.push({'petal.width':d3.min(data, function(d){return d['petal.width']})})

            // Compute the maximum and minimum values from the average values to use for later
            max_y_value = Object.values(all_y_values[0])[0]
            min_y_value = Object.values(all_y_values[0])[0]
            all_y_values.forEach(element => {
                max_y_value = Math.max(max_y_value, Object.values(element)[0])
                min_y_value = Math.min(min_y_value, Object.values(element)[0])
            });
        } 
  
        // Create the legend
        // This array of objects encodes each iris variety to an assigned color
        var bar_classes = [0, 0.25, 0.5, 1.0].map((val) => {
            return d3.interpolateReds(val);
        })

        // Rectangles for legend
        svg_bar_legend.append("g")
            .selectAll("rect")
            .data(bar_classes)
            .join("rect")
            .attr("x", function(d, i) { return i * 70; })
            .attr("y", 15)
            .attr("width", 70)
            .attr("height", 30)
            .style("fill", function(d) { 
                return d;
            });

        // Legend title
        svg_bar_legend.append("text")
            .attr("x", 90)
            .attr("y", -10)
            .text("Range of Values")
            .style("font-size", "13px")
            .attr("alignment-baseline","middle")

        // Legend minimum value on the left
        svg_bar_legend.append("text")
            .attr("x", -30)
            .attr("y", 25)
            .text(Math.round(min_y_value * 100) / 100) // This rounds to 2 decimal places
            .style("font-size", "13px")
            .attr("alignment-baseline","middle")

        // Legend maximum value on the right
        svg_bar_legend.append("text")
            .attr("x", 290)
            .attr("y", 25)
            .text(Math.round(max_y_value * 100) / 100)
            .style("font-size", "13px")
            .attr("alignment-baseline","middle")

        // Add original x-axis tick marks and values
        xDomain = Object.keys(data[0]).filter(function(attribute) {
            return attribute != 'variety';
        });
        
        // Create a scale band for x axis
        var xScale_bar = d3.scaleBand()
            .domain(xDomain)
            .range([0, width])
            .padding(0.4);


        svg_bar.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale_bar))



        // Add original y-axis tick marks and values
        var yScale_bar = d3.scaleLinear()
            .domain([0, (1.05 * max_y_value)])
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



        // Create a group element for the grid lines
        var grid = svg_bar.append("g")
            .attr("class", "grid");


        // Add horizontal grid lines
        grid.selectAll(".horizontal")
            .data(yScale_bar.ticks())
            .enter()
            .append("line")
            .attr("class", "horizontal")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", function(d) { return yScale_bar(d); })
            .attr("y2", function(d) { return yScale_bar(d); })
            .attr("stroke-dasharray", "2,2")

        // Add vertical grid lines
        grid.selectAll(".vertical")
            .data(xScale_bar.domain())
            .enter()
            .append("line")
            .attr("class", "vertical")
            .attr("x1", function(d) { return xScale_bar(d) + xScale_bar.bandwidth()/2; })
            .attr("x2", function(d) { return xScale_bar(d) + xScale_bar.bandwidth()/2; })
            .attr("y1", 0)
            .attr("y2", height)
            .attr("stroke-dasharray", "2,2")
            .attr("stroke-width", 1);

        d3.selectAll(".grid line")
            .style("stroke", "#d3d3d3");



        // Add original sequential color map
        var colorScale = d3.scaleSequential()
        .domain([min_y_value, max_y_value])
        .interpolator(d3.interpolateReds);

        // Append bars to the bar chart with the appropriately scaled height
        svg_bar.selectAll(".bar")
            .data(all_y_values)
            .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return xScale_bar(Object.keys(d)[0]); })
                .attr("y", function(d) { return yScale_bar(Object.values(d)[0]); })
                .attr("width", xScale_bar.bandwidth())
                .attr("height", function(d) { return height - yScale_bar(Object.values(d)[0]); })
                .style("stroke", "black")
                .style("stroke-width", 1)
                .style("fill", function(d) { return colorScale(Object.values(d)[0]); }); // Use the color scale to set the bar color        



        // Add y-value for each bar, above the bar. Make sure y-value corresponds to radio button
        svg_bar.selectAll("bar-title")
            .data(all_y_values)
            .enter()
            .append("text")
            .classed('bar-title', true)
            .attr('text-anchor', 'middle')
            .attr("x", function(d) { return xScale_bar(Object.keys(d)[0]) + 30; })
            .attr("y", function(d) { return yScale_bar(Object.values(d)[0]) - 5; })
            .style("font", "11px monaco")
            .text(d => Math.round(Object.values(d)[0] * 100) / 100); // Rounds value to 2 decimal places

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
            .text(radioValue);

        svg_bar.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2) + 5)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Average Values Per Attribute");
    }
    
    // The below code works similarly to the scatter plot's dropdown change function
    // Every time a radio button is selected, the function should call the drawBarChart(...)
    // function with the value being selected.
    d3.selectAll(("input[name='barChartButton']")).on("change", function() {
        // console.log("radio button changed to ", this.value);


        drawBarChart(this.value);
    });
})