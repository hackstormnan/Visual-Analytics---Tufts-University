
// Will be used to the save the loaded JSON data
var allData = [];

// Date parser to convert strings to date objects
var parseDate = d3.timeParse("%Y");

// Set ordinal color scale
const tab20 = [
	"#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78",
	"#2ca02c", "#98df8a", "#d62728", "#ff9896",
	"#9467bd", "#c5b0d5", "#8c564b", "#c49c94",
	"#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7",
	"#bcbd22", "#dbdb8d", "#17becf","#9edae5"]
var colorScale = d3.scaleOrdinal(tab20);

// Variables for the visualization instances
var areachart, timeline;

// main entrance of the demo
d3.json("../data/uk-household-purchases.json").then(function(data){
	loadData(data);
})

function loadData(data) {
			allData = data;

			// Convert Pence Sterling (GBX) to USD and years to date objects
			allData.layers.forEach(function (d) {
				for (var column in d) {
					if (d.hasOwnProperty(column) && column !== "Year") {
						d[column] = parseFloat(d[column]) * 1.481105 / 100;
					} else if (d.hasOwnProperty(column) && column === "Year") {
						d[column] = parseDate(d[column].toString());
					}
				}
			});

			//data by years
			allData.years.forEach(function (d) {
				d.Expenditures = parseFloat(d.Expenditures) * 1.481105 / 100;
				d.Year = parseDate(d.Year.toString());
			});

			// Update color scale (all column headers except "Year")
			// We will use the color scale later for the stacked area chart
			colorScale.domain(Object.keys(allData.layers[0]).filter(function (d) { return d !== "Year"; }))

			createVis();
}

function createVis() {
	// Instantiate visualization objects
	areachart = new StackedAreaChart("stacked-area-chart", allData.layers);
	timeline = new Timeline("timeline", allData);
}