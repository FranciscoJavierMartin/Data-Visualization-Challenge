var format = d3.format(",");

// Set tooltips
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function (d) {
    return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Population: </strong><span class='details'>" + format(d.population) + "</span>";
  })

var margin = { top: 0, right: 0, bottom: 0, left: 0 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var color = d3.scaleThreshold()
  .domain([10000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1500000000])
  .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(3,19,43)"]);

var path = d3.geoPath();

var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append('g')
  .attr('class', 'map');

var projection = d3.geoMercator()
  .scale(130)
  .translate([width / 2, height / 1.5]);

var path = d3.geoPath().projection(projection);

svg.call(tip);

// World_countries extracted from: https://raw.githubusercontent.com/jdamiani27/Data-Visualization-and-D3/master/lesson4/world_countries.json
queue()
  .defer(d3.json, "world_countries.json")
  .defer(d3.json, "country-data.json")
  .await(ready);

function ready(error, data, population) {
  var populationById = {};

  /*
"Country Code": "ARB", 
   "Country Name": "Arab World", 
   "Value": 92490932.0, 
   "Year": 1960
  */

  population
    .filter(d=>d["Year"]===1960)
    .forEach( (d) => { populationById[d["Country Code"]] = +d["Value"] });
  data.features.forEach(function (d) { d.population = populationById[d.id] });

  var i=0;

  //setInterval(()=>{

/*
    1. Extrae todos los paises del agno en cuestion
    2. Dentro de population foreach, con el d.id, 
    buscar la poblacion de ese pais y asignarla

    Javascript tiene un metodo find

*/

    /*var agno=1960+i;
    i++;
    var paises60 = countryData.filter(data => data.Year === agno);

    population.forEach(function (d) { 
      var poblacion=paises60.find(p=>{console.log('D',d);console.log('p',p);return p["Country Code"]===d.id})["Value"];
      
      //populationById[d.id] = +d.population;
      populationById[d.id]= +poblacion;
      /*En lugar de esto, que asigne la poblacion del pais, tienes el Country Code con d.id*/ 
    //});
    /*data.features.forEach(function (d) { d.population = populationById[d.id] });

    svg.data(data.features)
    .style('fill',function (d) { return color(populationById[d.id]); })
  },2000)*/

  let mapa=svg.append("g")
    .attr("class", "countries")
    .selectAll("path")
    .data(data.features)
    .enter().append("path")
    .attr("d", path)
    .style('stroke', 'white')
    .style('stroke-width', 1.5)
    .style("opacity", 0.8)
    // tooltips
    .style("stroke", "white")
    .style('stroke-width', 0.3)
    .on('mouseover', function (d) {
      tip.show(d);

      d3.select(this)
        .style("opacity", 1)
        .style("stroke", "white")
        .style("stroke-width", 3);
    })
    .on('mouseout', function (d) {
      tip.hide(d);

      d3.select(this)
        .style("opacity", 0.8)
        .style("stroke", "white")
        .style("stroke-width", 0.3);
    })
    .style("fill", function (d) { return color(populationById[d.id]); })

    var i=0;
    let intervalo=setInterval(function(){
      console.log("Hola")

      if(1960+i===2017){
        console.log("Fin")
        clearInterval(intervalo)
      }

      let datos=population.filter(d=> d["Year"]===1960+i)
      console.log(datos.length)
      datos.forEach( (d) => { populationById[d["Country Code"]] = +d["Value"]; });
      /*
        Tengo el pais, sacar la poblacion segun id
      */
      data.features.forEach(function (d) { d.population = populationById[d.id] });
      mapa.data(data.features)
          .style("fill", function (d) { return color(populationById[d.id]); })
      
      i++;
      console.log(i)

    },2000)

}




