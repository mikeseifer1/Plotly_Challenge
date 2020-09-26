
// Function 1 wil get the metadata and we wil input the values in the demo box
// function 2 we will create the two graphs
// function 3 willl initializate the dashboard we will call function 1 and 2 with the first sample
// function 4 will change everything when you use drop down \

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
        //Gauge Plot
        var trace3 = {
            domain: { x: [0, 1], y: [0, 1] },
            value: firstResult.wfreq,
            title: { text: "Daily Frequency of Hand Washing" },
            type: "indicator",
            mode: "gauge+number"
        
    }
        var dataG = [trace3];

        var layoutG = {
            //title: "Daily Hand Washing",
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



function buildPlot(sampleID) {
    d3.json("samples.json").then((importedData) => {
        //console.log(importedData);
        var impData = importedData.samples;
        //var washFreqData = importedData.metadata;
        //console.log(impData);

        // Get every sample id once we input in the function 
        var metadataList = impData.filter(sampleObj => sampleObj.id == sampleID) 
        //var washFreqNum = washFreqData.filter(washNum => washNum.wfreq == sampleID)
        var firstResult = metadataList[0];
        //var firstWash = washFreqNum[0];
        var sampleValues = firstResult.sample_values;
        var otuIds = firstResult.otu_ids;
        var otu_labels = firstResult.otu_labels;
        //var washFreq = firstWash.wfreq;
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

        // bubble plot
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

function init(){
    var selectionDropDown = d3.select("#selDataset");

    // use d3 to get the names from the samples.json
    d3.json("samples.json").then((data)=>{
        var sampleNames = data.names;

        sampleNames.forEach((dataSample)=> {
            selectionDropDown
                .append("option")
                .text(dataSample)
                .property("value", dataSample)
        });

        // get the first sample from the list and build graphs
        var initialSample = sampleNames[0];
        buildPlot(initialSample);
        Metadata(initialSample);
    });
}


function optionChanged(nextSample){
    // let get the data of the next sample
    buildPlot(nextSample);
    Metadata(nextSample); 
}
init();