var data_sen = [{
                "name": "Humberto Costa",
                "value": 2345,
                "account": "senadorhumberto",
                "party": "PT", "state": "PE"
        },
            {
                "name": "Alvaro Dias",
                "value": 1725,
                "account": "alvarodias_",
                "party": "PODEMOS", "state": "PR"
        },
            {
                "name": "Jorge Kajuru",
                "value": 1489,
                "account": "SenadorKajuru",
                "party": "PSL", "state": "MS"
        },
            {
                "name": "Soraya Thronicke",
                "value": 1293,
                "account": "SorayaThronicke",
                "party": "PP", "state": "GO"
        },
            {
                "name": "Vanderlan Cardoso",
                "value": 1288,
                "account": "Vanderlan_VC",
                "party": "PT", "state": "GO"
        },
            {
                "name": "Jaques Wagner",
                "value": 1099,
                "account": "jaqueswagner",
                "party": "PT", "state": "BA"
        },
            {
                "name": "Sérgio Olímpio",
                "value": 1063,
                "account": "majorolimpio",
                "party": "PSL", "state": "SP"
        },
            {
                "name": "Plínio Valério",
                "value": 1015,
                "account": "PlinioValerio45",
                "party": "PSDB", "state": "AM"
        },
            {
                "name": "Lasier Martins",
                "value": 998,
                "account": "lasiermartins",
                "party": "PODEMOS", "state": "RS"
        },
            {
                "name": "Randolfe Rodrigues",
                "value": 974,
                "account": "randolfeap",
                "party": "REDE", "state": "AP"
        }];


//sort bars based on value
data_sen = data_sen.sort(function (a, b) {
    return d3.descending(a.value, b.value);
})

var padding = {x: 50, y: 20};

//set up svg using margin conventions
var margin = {
    top: 15,
    right: 50,
    bottom: 15,
    left: 100
};

var config = {
  "avatar_size": 60,
  "radius": 30
}

var width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var svg_sen = d3.select("#divsenador").append("svg")
    .attr("id", "svg-sen")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
      .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x_sen = d3.scaleLinear()
    .range([0, width])
    .domain([0, d3.max(data_sen, function (d) {
        return d.value;
    })]);

var y_sen = d3.scaleBand()
        .rangeRound([0, width*0.8])
        .padding(0.3)
        .domain(data_sen.map(function (d) {
            return d.name;
    }));

//make y axis to show bar names
var yAxis_sen = d3.axisLeft()
    .scale(y_sen)
    //no tick marks
    .tickSize(0);

var gy_sen = svg_sen.append("g")
    .attr("class", "y axis")
    .call(yAxis_sen)

var bars_sen = svg_sen.selectAll(".bar-sen")
    .data(data_sen)
    .enter()
    .append("g")

//append rects
bars_sen.append("rect")
    .attr("class", "bar-sen")

    .transition()
    .duration(600)
    .attr("y", function (d) {
        return y_sen(d.name);
    })
    .attr("height", y_sen.bandwidth())
    .attr("x", 0)
    .attr("width", function (d) {
        return x_sen(d.value);
    })
    .style("fill","#FFDEAD")
    .delay(function(d,i){
          return(i*30)});

//remove text in axis
svg_sen.select(".axis").selectAll("text").remove();

// declare defs for images
var defs_sen = svg_sen.append("svg:defs");

data_sen.forEach(function(d, i) {
  defs_sen.append("svg:pattern")
    .attr("id", "grump_avatar_s" + i)
    .attr("width", config.avatar_size)
    .attr("height", config.avatar_size)
    .attr("patternUnits", "userSpaceOnUse")
    .append("svg:image")
    .attr("xlink:href", "./images/"+d.account+".jpg")
    .attr("width", config.avatar_size)
    .attr("height", config.avatar_size)
    .attr("x", 0)
    .attr("y", 0);
})

// calculate global coordinates for tooltip
var posX_svgsen = window.scrollX + document.querySelector('#divsenador').getBoundingClientRect().left // X
var posY_svgsen = window.scrollY + document.querySelector('#divsenador').getBoundingClientRect().top // Y


var ticks_sen = svg_sen.select(".axis").selectAll(".tick")
                        .data(data_sen)
                        .append("circle")
                          .attr("id", function (d,i) { return "c_" + i})
                          .attr("transform", "translate(" + (-margin.left+30)+ "," + "-30" + ")")
                          .attr("cx", config.avatar_size / 2)
                          .attr("cy", config.avatar_size / 2)
                          .attr("r", config.avatar_size / 2)
                          .style("fill", "#fff")
                          .style("stroke", "#FFDEAD")
                          .style("stroke-width", 3)
                          .style("fill", function (d,i) { return "url(#grump_avatar_s" + i + ")"})
                          .on("mouseover", function (d,i) {
                              // update circle
                              d3.select(this)
                                .transition()
                                .attr("r", config.radius*1.1)
                                .style("stroke","#DAA520")
                                .style("stroke-width", 4);
                              // update bar
                              svg_sen.selectAll(".bar-sen")
                                  .transition()
                                  .style("fill", function(e, j) { if (j==i) return "#DAA520";});
                              // update label
                              svg_sen.selectAll(".label")
                                  .transition()
                                  .attr("font-weight", function(e, j) { if (j==i) return "bolder";});

                              d3.select("#tooltip-sen")
                                .style("left", (posX_svgsen+770)+"px")
                            		.style("top",  (posY_svgsen+350)+"px")
                            		.select("#info-sen")
                            		.html(tooltipTextSen(d));

                            	d3.select("#tooltip-sen").classed("hidden", false);
                              })
                          .on("mouseout", mouseoutSen);

                        //hover opposite, to bring back to its original state
                        function mouseoutSen() {
                            d3.select(this)
                              .transition()
                              .attr("r", config.radius)
                              .style("stroke","#FFDEAD")
                              .style("stroke-width", 3);

                              svg_sen.selectAll(".bar-sen")
                                  .transition()
                                  .style("fill","#FFDEAD");

                              d3.select("#tooltip-sen").classed("hidden", true);

                              svg_sen.selectAll(".label")
                                  .transition()
                                  .attr("font-weight", "normal");
                        }

//add a value label to the right of each bar
bars_sen.append("text")
    .attr("class", "label")
    //y position of the label is halfway down the bar
    .attr("y", function (d) {
        return y_sen(d.name) + y_sen.bandwidth() / 2 + 4;
    })
    //x position is 3 pixels to the right of the bar
    .attr("x", function (d) {
        return x_sen(d.value) + 3;
    })
    .text(function (d) {
        return d.value;
    });

function tooltipTextSen(d) {
        return "<img src='./images/"+d.account+".jpg' width='"+180+"' height='"+180+"'>"+
            "<p style='text-align: center;'><strong>"+d.name+"</strong></p>"+
            "<p>UF:&nbsp;"+d.state+"</p>"+
            "<p>Partido:&nbsp;"+d.party+"</p>"+
            "<p><i><font color='#1DA1F2'>&#64;"+d.account+"</color></i></p>";
}
