# Challenge - Data visualization

## Instrucctions
Based on the population country and year we got on the first nvd3 sample (1960 - 2016 all countries in the world), create a world map chart and combo to pick the year and display data as a plus create an animated version, transitioning from 1960 to 2016.

## Files with data
- `country-data.json` : A file with data population of many countries arround the world for several years (1960 - 2016).
- `world_countries.json` : A file with geometry data of all countries around the world.

## `index.html`
In the body tag, a div has been included a div that contains a span that shows the current year, and a div with `#map` id that contains the world map.

## `styles.css`
Contains many styles. I only add two styles to increase the year font size and center the content with panel style

## `main.js`
~~~
const FIRST_YEAR=1960;
const LAST_YEAR=2016;
const INTERVAL_DURATION=2000; //In milliseconds
~~~
Show the first year that we show, the last year and the duration of the interval that update the data.

~~~
population
    .filter(d=>d["Year"]===FIRST_YEAR)
    .forEach( d =>  populationById[d["Country Code"]] = +d["Value"] );

data.features.forEach( d => d.population = populationById[d.id] );
~~~
Population contains the data of countries's population between 1960 and 2016. Data contains the geometry data per country.

First filter the population data by the first year (1960) and add to an json that cointains the countries in `"country_name":population` format, then add population data to geometry data to represent on a map.

Later create the map and add to html with all styles necesaries.

~~~
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
    .forEach( d =>  populationById[d["Country Code"]]= +d["Value"]);
  //Add population data to the data map
  data.features.forEach( d => d.population =populationById[d.id] );
  //Add a color to each country according to hispopulation
  mapa.data(data.features)
      .style("fill", d => color(populationById[d.id]));
  
  i++;
},INTERVAL_DURATION);
~~~
Create a `i` var to iterate over the years.

The interval iterate each 2 seconds by default executing the following instrucctions:
- Write on the html the current year.
- Filter the data per current year and add to map.
- Add color to each countries according his current population.
- Repeat

When the 2016 year is overpass, the interval execution is finished.