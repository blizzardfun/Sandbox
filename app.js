function buildMetadata(sample) {
  //console.log("buildMetadata", sample);
    // build the metadata panel 
    // also calls buildsGauge since WFREQ is available from metadata
    // select the panel with id of `#sample-metadata`
  metaData=d3.select("#sample-metadata");
      //  to clear any existing metadata
  metaData.html("");
  metaData.append("ul");

 //  fetch the metadata for a sample
    // add each key and value pair to the panel
    // change format of some keys for display
  d3.json(`/metadata/${sample}`).then(function(result){
    Object.entries(result).forEach(([key,value]) => {
          switch(key) {
            case "sample":
              newKey="SAMPLE";
              break;
            case "BBTYPE":
              newKey="BB TYPE";
              break;
            case "WFREQ":
              newKey="W FREQ"
              break;
            default:
              newKey=key;
          }
            // append new tags for each key-value in the metadata.
          metaData.append("li").text(`${newKey}: ${value}`);
      });

    //  Build the Gauge Chart
    buildGauge(result.WFREQ);
    });
  
}
//************************************************************************
function buildCharts(sample) {
  //console.log("buildCharts",sample);
  // builds pie chart and bubble chart 
  // data retrieved from /samples route which comes from 
  // samples table

  // select the div with id "pie"
  var pieDiv= d3.select("#pie");
  // clear existing data
  pieDiv.html("");
  // select the div with id "bubble"
  var bubbleDiv= d3.select("#bubble");
  // clear existing data
  bubbleDiv.html("");

  // fetch the sample data
  d3.json(`/samples/${sample}`).then(function(result){

       //build the pie chart---------------------
    //console.log(result);
  var pieTrace ={
      labels :result.otu_ids.slice(0,10),
      values :result.sample_values.slice(0,10),
      type :'pie',
      hovertext:result.otu_labels.slice(0,10),
      hoverinfo:"text",
      marker: {
        colors:['#cc615d','#ccb45d', '#9ccc5d','#5dcc8b', 
        '#5dccc2','#5d94cc', '#795dcc',
        '#b05dcc','#cc5d98','#ed7874'],
      },
    };

  var pieLayout = {
      title: 'Bacteria Sample Values',
      height: 400,
      width: 400,
     };

  //console.log(pieTrace);
  var pieData = [pieTrace];
  Plotly.newPlot("pie",pieData,pieLayout);

  //build the bubble chart-------------------------
  var bubbleTrace= {
    x:result.otu_ids,
    y:result.sample_values,
    mode: 'markers',
    marker: {
      color: result.otu_ids,
      opacity:0.8,
      size: result.sample_values,
      },
    text:result.otu_labels,
    hoverinfo:"text",
    textinfo:"text" 

    };

  var bubbleLayout = {
      // title: "Sample ${sample}",
      height: 500,
      width: 1200,
     };

  //console.log(bubbleTrace);
  var bubbleData=[bubbleTrace];
  Plotly.newPlot("bubble",bubbleData,bubbleLayout)
  })
};
 

//************************************************************************
function init() {
  // initializes the metadata
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  //console.log("init");
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
    // console.log("firstSample", firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
//*************************************************************************
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
