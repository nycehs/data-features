"use strict";

// Create and initialize variables
var nyccasData = [];
var neighborhoodData = [];
var selectedNeighborhood = ['']; //document.querySelector("#ntaField")

var selectedName = '';
var dPM = 0;
var dNO2 = 0;
var dBuildingEmissions = 0;
var dBuildingDensity = 0;
var dTrafficDensity = 0;
var dIndustrial = 0;
var tabShown = 'tab-01-a'; //let tabSpec = '';
//const trafficMapSpec = "./js/TrafficmapSpec.vl.json";    //These spec definitions were moved to a tab function
//const industrialMapSpec = "./js/IndustrialmapSpec.vl.json";
//const BDmapSpec = "./js/BDmapSpec.vl.json";
//const BEmapSpec = "./js/BEmapSpec.vl.json";

var PMBarSpec = "js/PMBarSpec.vl.json";
var PMBarVGSpec = "js/PMBarSpec.vg.json";
var NO2BarVGSpec = "js/NO2BarSpec.vg.json";
var embed_opt = {
  actions:false
};
var mapSearch = document.querySelector("#map-search"); // creates a constant to hold the map search component selector

mapSearch.addEventListener('keyup', console.log('hi from mapSearch!')); //Neighborhood Selector Button

var outBtn = document.querySelector("#outputButton"); //creates a constant to hold the submit button query selector

outBtn.addEventListener("click", dataChange); // listens for button clicks to change neighborhood, changes data
// Locator Map

var map = new nyc.ol.FrameworkMap({
  mapTarget: '#mapLocator',
  searchTarget: '#map-search',
  startAt: '125 Worth Street',
  geoclientUrl: 'https://maps.nyc.gov/geoclient/v2/search.json?app_key=74DF5DB1D7320A9A2&app_id=nyc-lib-example' // Developer portal app_key and id don't work, though the nycLib example works
  //geoclientUrl: 'https://maps.nyc.gov/geoclient/v1/search.json?app_key=cfed478bf47829a2951bc5a3bbc26422&app_id=2d2a1b38'

}); //the d3 code below loads the NTA map data

var nta_topojson = d3.json("https://grantpezeshki.github.io/NYC-topojson/NTA.json"); //the d3 code below loads the data from a CSV file and dumps it into global javascript object variable.

d3.csv("./data/NTA_tertilesWpm_no2.csv").then(function (data) {
  //console.log(data); // [{"Hello": "world"}, …]
  nyccasData = data;
  neighborhoodData = nyccasData.filter(function (sf) {
    return sf.NTACode === selectedNeighborhood;
  });
  console.log(nyccasData);
  console.log(selectedNeighborhood);
  console.log(neighborhoodData);
}); // dataChange function updates selected neighborhood, then filter nyccas data and get new neighborhood data, then adds to DOM

function dataChange() {
  console.log('hi from dataChange function');
  selectedNeighborhood = map.location.data.nta; //document.querySelector("#ntaField").value;

  neighborhoodData = nyccasData.filter(function (sf) {
    return sf.NTACode === selectedNeighborhood;
  });
  selectedName = map.location.data.ntaName; //neighborhoodData[0].NTAName;

  dPM = neighborhoodData[0].Avg_annavg_PM25;
  dPM = numRound(dPM);
  dNO2 = neighborhoodData[0].Avg_annavg_NO2;
  dNO2 = numRound(dNO2);
  dBuildingEmissions = neighborhoodData[0].tertile_buildingemissions;
  dBuildingDensity = neighborhoodData[0].tertile_buildingdensity;
  dTrafficDensity = neighborhoodData[0].tertile_trafficdensity;
  dIndustrial = neighborhoodData[0].tertile_industrial;
  document.querySelector("#NTA").innerHTML = 'Your neighborhood: <h3><span style="font-weight:bold;color:#15607a">' + selectedName + '</span></h3>';
  document.querySelector("#NTA2").innerHTML = selectedName;
  document.querySelector("#NTA3").innerHTML = selectedName;
  document.querySelector("#PM").innerHTML = dPM + ' μg/m<sup>3</sup>';
  document.querySelector("#NO2").innerHTML = dNO2 + ' ppb';
  document.querySelector("#BuildingEmissions").innerHTML = 'Building emissions<br><h5>' + tertileTranslate(dBuildingEmissions) + '</h5>';
  document.querySelector("#BuildingDensity").innerHTML = 'Building density<br><h5>' + tertileTranslate(dBuildingDensity) + '</h5>';
  document.querySelector("#TrafficDensity").innerHTML = 'Traffic density<br><h5>' + tertileTranslate(dTrafficDensity) + '</h5>';
  document.querySelector("#Industrial").innerHTML = 'Industrial area<br><h5>' + tertileTranslate(dIndustrial) + '</h5>';
  loadMap(tabShown);
  loadPMBar();
  loadNO2Bar();
  console.log('changed');
  console.log(selectedNeighborhood);
} // rounding function lets us round all numbers the same


function numRound(x) {
  return Number.parseFloat(x).toFixed(1);
} // jquery commands track tab changes


$(document).ready(function () {
  $(document).alert('hi from jquery');
  $(".nav-pills a").click(function () {
    $(this).tab('show');
  });
  $('.nav-pills a').on('shown.bs.tab', function (event) {
    tabShown = $(event.target).attr('aria-controls'); // active tab
    // var y = $(event.relatedTarget).text();  // previous tab

    $(".act span").text(tabShown);
    $(".prev span").text("did it again");
    loadMap(tabShown);
    loadPMBar();
    loadNO2Bar();
  });
}); //Returns block-level badges for the tabs

function tertileTranslate(tertileVal) {
  if (tertileVal === "3") {
    return '<span class="badge badge-worse btn-block">high</span>';
  } else if (tertileVal === "2") {
    return '<span class="badge badge-medium btn-block">medium</span>';
  } else {
    return '<span class="badge badge-better btn-block">low</span>';
  }

  ;
} //Returns in-line badges for text


function tertileTranslate2(tertileVal) {
  if (tertileVal === "3") {
    return '<span class="badge badge-worse">high</span>';
  } else if (tertileVal === "2") {
    return '<span class="badge badge-medium">medium</span>';
  } else {
    return '<span class="badge badge-better">low</span>';
  }

  ;
} //Returns map insert/update div IDs


function mapUpdateID(tabShown) {
  if (tabShown === "tab-01-a") {
    return '#BEmap';
  } else if (tabShown === "tab-01-d") {
    return '#BDmap';
  } else if (tabShown === "tab-01-b") {
    return '#Industrialmap';
  } else if (tabShown === "tab-01-c") {
    return '#Trafficmap';
  } else {
    console.log('Error: not sure which map to update');
  }

  ;
} //Returns map specs for proper tab context


function mapUpdateSpec(tabShown) {
  if (tabShown === "tab-01-a") {
    return "./js/BEmapSpec.vg.json";
  } else if (tabShown === "tab-01-d") {
    return "./js/BDmapSpec.vg.json";
  } else if (tabShown === "tab-01-b") {
    return "./js/IndustrialmapSpec.vg.json";
  } else if (tabShown === "tab-01-c") {
    return "./js/TrafficmapSpec.vg.json";
  } else {
    console.log('Error: not sure which map to update');
  }

  ;
} //create a function to load the Building Density map. Invoked when user clicks the tab or when neighborhood changes.


function loadMap() {
  //console.log(mapUpdateID(tabShown));
  vegaEmbed(mapUpdateID(tabShown), mapUpdateSpec(tabShown), embed_opt).then(function (result) {
    // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
    //result.view.insert('selectedNabe',selectedNeighborhood).run()
    result.view.signal("selectNTA", selectedNeighborhood).runAsync();
  }).catch(console.error);
} // load the maps initially


loadMap(); 

// load the PM Bar Chart
var el = document.getElementById('PMbar');
var pmBarView = vegaEmbed("#PMbar", PMBarVGSpec, embed_opt)
//.catch(function (error) {
//  return showError(el, error);
//})
.then(function (res) {
  return res.view.signal("selectNTA", selectedNeighborhood).runAsync();
}).catch(console.error);

function loadPMBar() {
  pmBarView = vegaEmbed("#PMbar", PMBarVGSpec, embed_opt)
 // .catch(function (error) {
 //   return showError(el, error);
 // })
  .then(function (res) {
    return res.view.signal("selectNTA", selectedNeighborhood).runAsync();
  }).catch(console.error);
} 

// load the NO2 Bar Chart


var ele = document.getElementById('NO2bar');
var NO2BarView = vegaEmbed("#NO2bar", NO2BarVGSpec, embed_opt)
//.catch(function (error) {
//  return showError(ele, error);
//})
.then(function (res) {
  return res.view.insert("nyccasData", nyccasData).signal("selectNTA", selectedNeighborhood).runAsync();
}).catch(console.error);

function loadNO2Bar() {
  NO2BarView = vegaEmbed("#NO2bar", NO2BarVGSpec, embed_opt)
//  .catch(function (error) {
//    return showError(ele, error);
 // })
  .then(function (res) {
    return res.view.insert("nyccasData", nyccasData).signal("selectNTA", selectedNeighborhood).runAsync();
  }).catch(console.error);
}
/*   //These scripts load the maps initially but once a neighborhood is selected this is not needed
 //var spec = "https://raw.githubusercontent.com/vega/vega/master/docs/examples/bar-chart.vg.json";
var PMmapSpec = "./js/PMmapSpec.vl.json"
vegaEmbed('#PMmap', PMmapSpec).then(function(result) {
  // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
  //result.view.insert('selectedNabe',selectedNeighborhood).run()
}).catch(console.error);
  // these load the maps initially. 
 vegaEmbed('#BEmap', BEmapSpec).then(function(result) {
  // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
  //result.view.insert('selectedNabe',selectedNeighborhood).run()
}).catch(console.error);
 vegaEmbed('#BDmap', BDmapSpec).then(function(result) {
  // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
  //result.view.insert('selectedNabe',selectedNeighborhood).run()
}).catch(console.error);
 vegaEmbed('#Industrialmap', industrialMapSpec).then(function(result) {
  // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
  //result.view.insert('selectedNabe',selectedNeighborhood).run()
}).catch(console.error);
 vegaEmbed('#Trafficmap', trafficMapSpec).then(function(result) {
  // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
  //result.view.insert('selectedNabe',selectedNeighborhood).run()
}).catch(console.error);
*/

// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/append()/append().md
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('append')) {
      return;
    }
    Object.defineProperty(item, 'append', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function append() {
        var argArr = Array.prototype.slice.call(arguments),
          docFrag = document.createDocumentFragment();
        
        argArr.forEach(function (argItem) {
          var isNode = argItem instanceof Node;
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
        });
        
        this.appendChild(docFrag);
      }
    });
  });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);