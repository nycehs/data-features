
let ntaSpec = "mapnta.vl.json";

const opt = {"renderer":"svg"};
const el = document.getElementById('map');


  function ntaMapCreate() {
    vegaEmbed('#map', ntaSpec, opt).then(function(result) {
        // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
        viewObj = result.view;
      }).catch(console.error);
    }

ntaMapCreate();
