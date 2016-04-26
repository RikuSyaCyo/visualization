function drawStatistics(svgID, mapName, statisID) {
    var tID = "tooltip_text";
    var svg = d3.select("#" + svgID);
    var width = svg.attr("width");
    var height = svg.attr("height");
    var statisGroups = svg.append("g")
                            .attr("id", statisID);
    var padding = { top: 820, right: 200, bottom: 20, left: 30 };
    var color = "#bcbddc";
    d3.json("./statistics/" + mapName + ".json", function (error, data) {
        if (error) return console.error(error);
        var dataset = data.dataset;
        var maxCas = d3.max(dataset[0].casualties, function (d) { return d[2] });
        var xScale = d3.scale.linear()
                        .domain([2007, 2016])
                        .range([0,width - padding.left - padding.right]);
        var yScale = d3.scale.linear()
                        .domain([0, maxCas * 1.1])
                        .range([height - padding.top - padding.bottom,0]);
        var linePath = d3.svg.line()
                            .x(function (d) { return xScale(d[0]+1.0/12.0*d[1]); })
                            .y(function (d) { return yScale(d[2]);});
        statisGroups.selectAll("path")
                    .data(dataset)
                    .enter()
                    .append("path")
                    .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
                    .attr("d", function (d) {
                        return linePath(d.casualties);
                    })
                    .attr("fill", "none")
                    .attr("stroke-width", "2px")
                    .attr("stroke", color);
        var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .ticks(16)
                        .tickFormat(d3.format("d"))
                        .orient("bottom")
                        ;
        statisGroups.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
                    .call(xAxis);
        var focusGroups = statisGroups.append("g")
                                    .attr("class", "focusGroups");
        for (var p in dataset[0].casualties)
        {
            var dP=dataset[0].casualties[p];
            if (dP[2] > 0)
            {
                focusGroups.append("circle")
                                        .datum(dP)
                                        .attr("cx", function (d) { return xScale(d[0] + 1.0 / 12.0 * d[1]) })
                                        .attr("cy", function (d) { return yScale(d[2])})
                                        .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
                                        .attr("r", "18px")
                                        .attr("fill", "none")
                                        .attr("pointer-events","all")
                                        .on("mouseover", function (d) {
                                            d3.select("#" + tID).style("left", function () {
                                                var cx = xScale(d[0] + 1.0 / 12.0 * d[1]);
                                                return cx + "px";
                                            })
                                                               .style("top", yScale(d[2])+padding.top-50+"px")
                                                               .style("opacity", 1)
                                                               .html(d[0]+"."+d[1]+"<br>"+"casualties:"+d[2]);
                                        })
                                        .on("mouseout", function () {
                                            d3.select("#" + tID).style("left","0px")
                                                                .style("top","0px")
                                                                .style("opacity", 0);
                                        })
                                        .on("mousemove", function (d) {
                                        });
            }
        }
    });
}