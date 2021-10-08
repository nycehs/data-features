// Create and initialize variables
let nyccasData = [];
let neighborhoodData =[];
let selectedNeighborhood = [''];  //document.querySelector("#ntaField")
let selectedName = '';
let dPM = 0;
let dNO2 = 0;
let dBuildingEmissions = 0;
let dBuildingDensity = 0;
let dTrafficDensity = 0;
let dIndustrial = 0;
let tabShown = "";
//let tabSpec = '';

//const trafficMapSpec = "./js/TrafficmapSpec.vl.json";    //These spec definitions were moved to a tab function
//const industrialMapSpec = "./js/IndustrialmapSpec.vl.json";
//const BDmapSpec = "./js/BDmapSpec.vl.json";
//const BEmapSpec = "./js/BEmapSpec.vl.json";
const PMBarSpec="js/PMBarSpec.vl.json";
const PMBarVGSpec="js/PMBarSpec.vg.json";
const NO2BarVGSpec="js/NO2BarSpec.vg.json";
const embed_opt = {"mode": "vega-lite"};  


//Neighborhood Selector Button
const outBtn = document.querySelector("#ntaSubmitButton"); //creates a constant to hold the submit button query selector
outBtn.addEventListener("click",dataChange); // listens for button clicks to change neighborhood, changes data


//the d3 code below loads the NTA map data
let nta_topojson = d3.json("data/NTA2.topojson")


//the d3 code below loads the data from a CSV file and dumps it into global javascript object variable.
d3.csv("./data/NTA_tertilesWpm_no2.csv").then(function(data) {
    //console.log(data); // [{"Hello": "world"}, …]
    nyccasData=data;
    neighborhoodData = nyccasData.filter(function (sf){
            return sf.NTACode === selectedNeighborhood;
        });
    console.log(nyccasData);
    console.log(selectedNeighborhood);
    });     

function dataChange(){
    selectedNeighborhood=document.querySelector("#ntaField").value;
    document.querySelector("#NTA").innerHTML = selectedNeighborhood;
    loadMap()
    console.log("hi");
}

function mapUpdateID(tabShown){
    if (tabShown==="") {
        return '#BEmap';
      }}

function mapUpdateSpec(tabShown){
    if (tabShown==="") {
        return "js/BEmapSpec.vg.json";
      }}

//create a function to load the Building Density map. Invoked when user clicks the tab or when neighborhood changes.
function loadMap(){
    //console.log(mapUpdateID(tabShown));
    vegaEmbed(mapUpdateID(tabShown), mapUpdateSpec(tabShown)

      ).then(function(result) {
      // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
      //result.view.insert('selectedNabe',selectedNeighborhood).run()
      result.view
              .signal("selectNTA",selectedNeighborhood)
              .runAsync();
    }).catch(console.error);
  }

  // load the maps initially
 // loadMap();