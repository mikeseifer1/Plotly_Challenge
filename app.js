
// Metadata Function will get the metadata and input the values in to the demo box.

function Metadata(sampleID){

    d3.json("samples.json").then((importedData) => {
        //console.log(importedData);
        var impData = importedData.metadata;
        //console.log(impData);

        // Get every sample id once we input in the function 
        var metadataList = impData.filter(sampleObj => sampleObj.id == sampleID) 
        //var metaDataWashList = impData.filter(washObj => washObj. == sampleID)
        var firstResult = metadataList[0];
        console.log(firstResult.wfreq);
        // we need place the results in the index.html
        var metadataLoc = d3.select("#sample-metadata");

        metadataLoc.html(""); // clear the box

        // Use object entries to loop thru the dictionary toinpyt each key and value
        Object.entries(firstResult).forEach(([key, value])=> {
            metadataLoc.append("h5").text(`${key}: ${value}`);
        })
        //Gauge Plot. I added the bonus section here because it uses the handwashing number from metaadata
        //instead of recreating it all at the bottome of the code.
        var trace3 = {
            domain: { x: [0, 1], y: [0, 1] },
            value: firstResult.wfreq,
            title: { text: "Daily Frequency of Hand Washing" },
            type: "indicator",
            mode: "gauge+number"
        
    }
        var dataG = [trace3];

        var layoutG = {
            width: 500,
            height: 350,
            margin: { t: 25, b: 25, l: 25, r: 25 },
            grid: { rows: 2, columns: 2, pattern: "independent" },
            template: {
            data: {
            indicator: [
            {
            mode: "number+gauge",
            //delta: { reference: 9 },
            gauge: {axis:{range:[null,9]}}
        }
    ]
    }
    }
        }
        Plotly.newPlot('gauge', dataG, layoutG);
        });

}


//The buildPolt function is used to create the the bar and bubble graphs.
function buildPlot(sampleID) {
    d3.json("samples.json").then((importedData) => {
        var impData = importedData.samples;
        //console.log(impData);

        //Get every sample id once we input in the function 
        var metadataList = impData.filter(sampleObj => sampleObj.id == sampleID) 
        var firstResult = metadataList[0];
        var sampleValues = firstResult.sample_values;
        var otuIds = firstResult.otu_ids;
        var otu_labels = firstResult.otu_labels;
        console.log(firstResult);
        var trace1 = {
            y: otuIds.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
            x: sampleValues.slice(0,10).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"           
        };

        var data = [trace1];

        var layout = {
            title: `Top 10 OTUs`,
        };

    Plotly.newPlot("bar", data, layout);

        //Bubble plot
        var trace2 = {
            x: otuIds,
            y: sampleValues,
            text: otu_labels,
            mode: 'markers',
            marker: {
              size: sampleValues,
              color: otuIds,
              colorscale: "Jet"  
            }
          };
          
        var dataB = [trace2];
          
        var layoutB = {
            title: 'Bubble chart of Bachteria',
            showlegend: false,
            height: 1200,
            width: 1200
          };
          
          Plotly.newPlot('bubble', dataB, layoutB);
        
    });
}
//This function initializes the drop-down and updates the date and graphs with each new choice.
function init(){
    var selectionDropDown = d3.select("#selDataset");

    //Use d3 to get the names from the samples.json
    d3.json("samples.json").then((data)=>{
        var sampleNames = data.names;

        sampleNames.forEach((dataSample)=> {
            selectionDropDown
                .append("option")
                .text(dataSample)
                .property("value", dataSample)
        });

        //Get the first sample from the list and build graphs
        var initialSample = sampleNames[0];
        buildPlot(initialSample);
        Metadata(initialSample);
    });
}


function optionChanged(nextSample){
    //Get the data of the next sample
    buildPlot(nextSample);
    Metadata(nextSample); 
}
init();