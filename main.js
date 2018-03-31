const FIRST_YEAR=1960;
const LAST_YEAR=2016;
const INTERVAL_DURATION=2000; //In milliseconds

var format = d3.format(",");

// Set tooltips
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function (d) {
    return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Population: </strong><span class='details'>" + format(d.population) + "</span>";
  });

var margin = { top: 0, right: 0, bottom: 0, left: 0 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var color = d3.scaleThreshold()
  .domain([10000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000, 500000000, 1500000000])
  .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(3,19,43)"]);

var path = d3.geoPath();

var svg = d3.select("#map")
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

  population
    .filter(d=>d["Year"]===FIRST_YEAR)
    .forEach( d =>  populationById[d["Country Code"]] = +d["Value"] );

  data.features.forEach( d => d.population = populationById[d.id] );

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
    .style("fill", d => color(populationById[d.id]));

    var i=1;
    
    let intervalo=setInterval(function(){

      //If we pass over the limit, stop the interval
      if(FIRST_YEAR+i===LAST_YEAR+1){
        clearInterval(intervalo)
      }

      //Add the current year to the year label
      d3.select("#year")
        .html(`${FIRST_YEAR+i}`)

      //Select the population per year and add to the data
      population.filter(d=> d["Year"]===FIRST_YEAR+i)
        .forEach( d =>  populationById[d["Country Code"]] = +d["Value"]);

      //Add population data to the data map
      data.features.forEach( d => d.population = populationById[d.id] );

      //Add a color to each country according to his population
      mapa.data(data.features)
          .style("fill", d => color(populationById[d.id]) );
      
      i++;
    },INTERVAL_DURATION);

}