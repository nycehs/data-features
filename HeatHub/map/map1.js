let geoDataURL = "../zcta.topo.json";
let covidDataURL = "../FakeZCTAData.csv";
let countSpec = "map1.vl.json";

const opt = {"renderer":"svg"};
const el = document.getElementById('map');

//this function creates the map
function countMapCreate() {
vegaEmbed('#map', countSpec, opt).then(function(result) {
    // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
    viewObj = result.view;
  }).catch(console.error);
}

countMapCreate();
