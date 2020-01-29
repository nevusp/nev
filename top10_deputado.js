var data_dep = [{
                "name": "Helio Lopes",
                "value": 9126,
                "account": "depheliolopes",
                "party": "PSL", "state": "RJ"
        },
            {
                "name": "Jose Guimarães",
                "value": 8478,
                "account": "guimaraes13PT",
                "party": "PT", "state": "CE"
        },
            {
                "name": "Carla Zambelli",
                "value": 8357,
                "account": "CarlaZambelli17",
                "party": "PSL", "state": "SP"
        },
            {
                "name": "Daniel Silveira",
                "value": 6208,
                "account": "danielPMERJ",
                "party": "PSL", "state": "RJ"
        },
            {
                "name": "Jose Medeiros",
                "value": 6000,
                "account": "JoseMedeirosMT",
                "party": "PODE", "state": "MT"
        },
            {
                "name": "Joao Bacelar",
                "value": 5893,
                "account": "DeputadoBacelar",
                "party": "PODE", "state": "BA"
        },
            {
                "name": "Bohn Gass",
                "value": 4133,
                "account": "BohnGass",
                "party": "PT", "state": "RS"
        },
            {
                "name": "Alexandre Frota",
                "value": 4037,
                "account": "alefrota77",
                "party": "PSDB", "state": "SP"
        },
            {
                "name": "Áurea Carolina",
                "value": 3739,
                "account": "aureacarolinax",
                "party": "PSOL", "state": "MG"
        },
            {
                "name": "Fernanda Melchionna",
                "value": 3646,
                "account": "fernandapsol",
                "party": "PSOL", "state": "RS"
        }];


//sort bars based on value
data_dep = data_dep.sort(function (a, b) {
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

var svg_dep = d3.select("#divdeputado").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
      .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x_dep = d3.scaleLinear()
    .range([0, width])
    .domain([0, d3.max(data_dep, function (d) {
        return d.value;
    })]);

var y_dep = d3.scaleBand()
        .rangeRound([0, width*0.8])
        .padding(0.3)
        .domain(data_dep.map(function (d) {
            return d.name;
    }));

//make y axis to show bar names
var yAxis_dep = d3.axisLeft()
    .scale(y_dep)
    //no tick marks
    .tickSize(0);

var gy_dep = svg_dep.append("g")
    .attr("class", "y axis")
    .call(yAxis_dep)

var bars_dep = svg_dep.selectAll(".bar-dep")
    .data(data_dep)
    .enter()
    .append("g")

//append rects
bars_dep.append("rect")
    .attr("class", "bar-dep")
    .transition()
    .duration(600)
    .attr("y", function (d) {
        return y_dep(d.name);
    })
    .attr("height", y_dep.bandwidth())
    .attr("x", 0)
    .attr("width", function (d) {
        return x_dep(d.value);
    })
    .style("fill","powderblue")
    .delay(function(d,i){
        return(i*30)});

//remove text in axis
svg_dep.select(".axis").selectAll("text").remove();

// declare defs for images
var defs_dep = svg_dep.append("svg:defs");

data_dep.forEach(function(d, i) {
  defs_dep.append("svg:pattern")
    .attr("id", "grump_avatar_d" + i)
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
var posX_svgdep = window.scrollX + document.querySelector('#divdeputado').getBoundingClientRect().left // X
var posY_svgdep = window.scrollY + document.querySelector('#divdeputado').getBoundingClientRect().top // Y

var ticks = svg_dep.select(".axis").selectAll(".tick")
                        .data(data_dep)
                        .append("circle")
                          .attr("id", function (d,i) { return "c_" + i})
                          .attr("transform", "translate(" + (-margin.left+30)+ "," + "-30" + ")")
                          .attr("cx", config.avatar_size / 2)
                          .attr("cy", config.avatar_size / 2)
                          .attr("r", config.avatar_size / 2)
                          .style("fill", "#fff")
                          .style("stroke", "powderblue")
                          .style("stroke-width", 3)
                          .style("fill", function (d,i) { return "url(#grump_avatar_d" + i + ")"})
                          .on("mouseover", function (d,i) {
                              // update circle
                              d3.select(this)
                                .transition()
                                .attr("r", config.radius*1.1)
                                .style("stroke","royalblue")
                                .style("stroke-width", 4);
                              // update bar
                              svg_dep.selectAll(".bar-dep")
                                  .transition()
                                  .style("fill", function(e, j) {
                                      if (j==i) return "royalblue";
                                      //else {return "powderblue";}
                                    });
                              // update label
                              svg_dep.selectAll(".label")
                                  .transition()
                                  .attr("font-weight", function(e, j) { if (j==i) return "bolder";});

                              // update tooltip
                              d3.select("#tooltip-dep")
                                .style("left", (posX_svgdep+770)+"px")
                                .style("top",  (posY_svgdep+350)+"px")
                            		//.style("left", 770 + "px")
                            		//.style("top", 350 + "px")
                            		.select("#info-dep")
                            		.html(tooltipTextDep(d));

                            	d3.select("#tooltip-dep").classed("hidden", false);
                              })
                          .on("mouseout", mouseoutC);

                        //hover opposite, to bring back to its original state
                        function mouseoutC() {
                          d3.select(this)
                            .transition()
                            .attr("r", config.radius)
                            .style("stroke","powderblue")
                            .style("stroke-width", 3);

                            svg_dep.selectAll(".bar-dep")
                                .transition()
                                .style("fill","powderblue");

                            d3.select("#tooltip-dep").classed("hidden", true);

                            svg_dep.selectAll(".label")
                                .transition()
                                .attr("font-weight", "normal");
                        }

//add a value label to the right of each bar
bars_dep.append("text")
    .attr("class", "label")
    //y position of the label is halfway down the bar
    .attr("y", function (d) {
        return y_dep(d.name) + y_dep.bandwidth() / 2 + 4;
    })
    //x position is 3 pixels to the right of the bar
    .attr("x", function (d) {
        return x_dep(d.value) + 3;
    })
    .text(function (d) {
        return d.value;
    });

function tooltipTextDep(d) {
        return "<img src='./images/"+d.account+".jpg' width='"+180+"' height='"+180+"'>"+
            "<p style='text-align: center;'><strong>"+d.name+"</strong></p>"+
            "<p>UF:&nbsp;"+d.state+"</p>"+
            "<p>Partido:&nbsp;"+d.party+"</p>"+
            "<p><i><font color='#1DA1F2'>&#64;"+d.account+"</color></i></p>";
}
