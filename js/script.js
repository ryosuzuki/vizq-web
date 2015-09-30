vizq.load(data.slice(0,1000))

// var data = require('data/fcq.5000.json')
var editor = ace.edit("editor");

var text = "{\n  Subject: 'col',\n  CrsLvlNum: 'col'\n}"
editor.setValue(text);


var result;

$('#data').text(JSON.stringify(window.data, null, 2));

$('#viz').click( function () {
  var text = editor.getValue();
  var json = hanson.parse(text)
  result = vizq.eval(json);
  console.log(result);
  $('#result').text(JSON.stringify(result, null, 2));
  $('.item').removeClass('active')
  $('.item[data-tab="result"').addClass('active')
  $.tab('change tab', 'result');
  visualize()
})

$('.menu .item').tab();



var margin = {top: 20, right: 20, bottom: 130, left: 40},
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

var xLabel, yLabel, bars;
var svg2, childre;

function visualize () {

  if (xLabel) xLabel.remove();
  if (yLabel) yLabel.remove();
  if (bars) bars.remove();
  if (svg2) svg2.remove();

  var name = Object.keys(result[0])[0];
  x.domain(result.map(function(d) { return d[name]; }));
  y.domain([0, d3.max(result, function(d) { return d.count; })]);

  xLabel = svg.append("g")
  .attr("class", "x axis")
  .style("text-anchor", "end")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  .selectAll("text")
  .attr("y", 0)
  .attr("x", 9)
  .attr("dy", ".35em")
  .attr("transform", "rotate(65)")
  .style("text-anchor", "start")

  yLabel = svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Frequency");

  bars = svg.selectAll(".bar")
  .data(result)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", function(d) { return x(d[name]); })
  .attr("width", x.rangeBand())
  .attr("y", function(d) { return y(d.count); })
  .attr("fill", function(d, i) { return color(i*4) })
  .attr("height", function(d) { return height - y(d.count); })
  .on('click', function(d, index) { drawRecursive(index) })


  function drawRecursive (index) {
    if (!result[index].children) return false;

    children = result[index].children;
    var name2 = Object.keys(children[0])[0];

    if (svg2) d3.select('#canvas2 svg').remove();

    svg2 = d3.select("#canvas2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(children.map(function(d) { return d[name2]; }));
    y.domain([0, d3.max(children, function(d) { return d.count; })]);

    svg2.append("g")
    .attr("class", "x axis")
    .style("text-anchor", "end")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(65)")
    .style("text-anchor", "start")

    svg2.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Frequency");

    svg2.selectAll(".bar")
    .data(children)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d[name2]); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.count); })
    .attr("fill", function(d, i) { return color(i*4) })
    .attr("height", function(d) { return height - y(d.count); })
    .on('click', drawRecursive)

    // visualize();
  }

  function type(d) {
    d.frequency = +d.frequency;
    return d;
  }

}
