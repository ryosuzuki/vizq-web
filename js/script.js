
// var data = require('data/fcq.5000.json')
var editor = ace.edit("editor");

var text = "A.load(data.slice(0,100))\nA.select(['Subject'])\nA.groupBy('Subject')"
editor.setValue(text);


var result;

$('#viz').click( function () {
  var text = editor.getValue();
  result = eval(text);
  console.log(result);
  $('#result').text(JSON.stringify(result, null, 2));
  visualize()
})


function visualize () {


  var margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = 500 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
  .range([height, 0]);

  var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

  var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(10);

  var color = d3.scale.category20b();

  var svg = d3.select("#canvas").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(result.map(function(d) { return d.Subject; }));
  y.domain([0, d3.max(result, function(d) { return d.count; })]);

  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

  svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Frequency");

  svg.selectAll(".bar")
  .data(result)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", function(d) { return x(d.Subject); })
  .attr("width", x.rangeBand())
  .attr("y", function(d) { return y(d.count); })
  .attr("fill", function(d, i) { return color(i*4) })
  .attr("height", function(d) { return height - y(d.count); });

  function type(d) {
    d.frequency = +d.frequency;
    return d;
  }

}
