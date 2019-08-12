function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

    // Use `d3.json` to fetch the metadata for a sample
    var url = `/metadata/${sample}`
    d3.json(url).then (function (response) {

      console.log(response)
    })

    // Use d3 to select the panel with id of `#sample-metadata`
    sampleData = d3.selectAll("#sample-metadata")

    // Use `.html("") to clear any existing metadata
    sampleData.html("")

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(sample).forEach(function ([key,value]) {
      var row = sampleData.append("p")
      row.text (`${key}: ${value}`)
    })   
}


function buildCharts(sample) {

// @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`
  d3.json(url).then(function(data)  {

   // BUILD PIE CHART

    d3.json(url).then(function(data) {

      var values = data.sample.values.slice(0,10)
      var labels = data.otu.ids.slice(0,10)
      var hovertext = data.otu_labels.slice(0,10)

      var data = [{
        values: values,
        labels: labels,
        hovertext: hovertext, 
        type: 'pie'
      }]


      Plotly.newPlot('pie_chart', data, layout)
  
   
    // BUILD BUBBLE CHART

    // tell plotly how to turn data into a visual
    var x = data.otu_ids
    var y = data.sample_values
    var size = data.sample_values
    var color = data.otu_ids
    var text = data.otu_labels

    var trace1 = {
      x: x,
      y: y,
      text : text,
      mode: 'markers',
      marker: {
        size: size,
        color: color
      }
    };
    
    var data = [trace1];
    
    // add format elements
    var layout = {
      title: 'Bacteria Distribution',
      //showlegend: false,
      height: 600,
      width: 600,
      xaxis: {title: "OTU ID"}
    };

 Plotly.newPlot('bubble_chart', data, layout)
  
});
  });   
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();