var t1ID = "tooltip";
var t2ID = "tooltip_event";
var svgID = "mapSVG";
var breturnID = "tooltip_return";
var gmIDs = new Array();
var circleStyle = { color: "rgba(255,134,125,0.3)" };

var gname = {
    "Taliban": "Taliban",
    "Al-Shabaab": "Al-Shabaab",
    "Islamic State of Iraq and the Levant (ISIL)": "ISIL",
    "Communist Party of India - Maoist (CPI-Maoist)": "CPI-Maoist",
    "Boko Haram": "BKHR",
    "Revolutionary Armed Forces of Colombia (FARC)": "FARC",
    "Tehrik-i-Taliban Pakistan (TTP)":"TTP"
};

var gcolor = {
    "Taliban": "orange",
    "Al-Shabaab": "purple",
    "Islamic State of Iraq and the Levant (ISIL)": "#87BB40",
    "Communist Party of India - Maoist (CPI-Maoist)": "RGB(130,184,234)",
    "Boko Haram": "red",
    "Revolutionary Armed Forces of Colombia (FARC)": "blue",
    "other": "lightgray"
}

function drawGlobalMap()
{

    d3.select("#mapGroup")
        .remove();
    d3.select("#" + svgID).style("top", "0px")
                   .style("height", "960px");
    d3.selectAll("img")
                  .style("opacity", 1.0);
    d3.select("#printname")
      .style("opacity", 0.0);
    d3.select("#timeline-embed")
      .remove();
    d3.select("#circle")
      .style("opacity", 0.0);
    d3.select("#buttonTable")
      .style("opacity", 0.0);
    d3.select("#orgTable")
      .style("opacity", 0.0);
    d3.select("#atkimg")
      .style("opacity", 0.0);
    d3.select("#tagimg")
      .style("opacity", 0.0);
    d3.selectAll("rect")
      .remove();
    d3.select("#axis")
      .remove();
    d3.select("#mark")
      .remove();

    d3.select("body")
        .style("cursor", "wait");
    _drawGlobalMap();
    d3.csv("./data/organization.csv", function (error, organization) {
        if (error) return console.error(error);
        _drawAnimation(organization);
    });
    d3.csv("./data/casualties.csv", function (error, casualties) {
        if (error) return console.error(error);
        d3.csv("./data/count.csv", function (error, count) {
            if (error) return console.error(error);
            d3.csv("./data/pieCasual.csv", function (error, pieCasual) {
                if (error) return console.error(error);
                d3.csv("./data/pieCount.csv", function (error, pieCount) {
                    if (error) return console.error(error);
                    _drawStatistics(casualties, count, pieCasual,pieCount);
                });
            });
        });
    });
}

function clearTAGS()
{
    for (var p in gmIDs)
    {
        d3.select("#" + gmIDs[p])
            .remove();
    }
}

function filter(d, year, orga)
{
    if (year != "All" && d.iyear != year)
        return false;
    if (orga != "All" && d.gname != orga)
        return false;
    return true;
}

function modifyCircles() {
    var p = d3.select("#yearSel").property("value");
    var t = d3.select("#orgaSel").property("value");
    var circles = d3.select("#circleGroup").selectAll("circle");
    circles.each(function (d) {
        var circle = d3.select(this);
        if (p == "All" && t == "All")
        {
            circle.attr("r", circleStyle.size)
                .style("fill", circleStyle.color);
            return;
        }
        var f = filter(d,p,t);
        if (f)
            circle.attr("r",circleStyle.size)
                    .style("fill", circleStyle.color);
        else
            circle.attr("r",circleStyle.size)
                    .style("fill", "none");
    });   
}

function update() {
    if (!AnimationFlag)
        return;
    var sel = d3.select("#yearSel");
    var p = sel.property("value");
    if (p == 2014 || p == "All" )
        sel.property("value", "2001");
    else
        sel.property("value", parseInt(p) + 1);
    modifyCircles();
    setTimeout(update, 600);
}

var AnimationFlag = false;

function _drawAnimation(organization)
{
    var div = d3.select("body")
           .append("div")
           .attr("id","selDIV")
           .attr("class", "selectDIV");
    gmIDs.push("selDIV");
    //table
    var table = div.append("table")
        .style("text-align", "left");
    var tbody = table.append("tbody")
           //.style("table-layout", "fixed")
            //.style("position", "relative")
            //.style("top", "10%");
           //.style("left", "1.5%")
    //.style("width", "97%");
    //标题
    var tr = tbody.append("tr");
    var th = tr.append("th")
        .attr("colspan",2)
        .style("text-align","center")
        .html("Select   ");
    th.append("button")
        .html("start")
        .on("click", function () {
            if (!AnimationFlag) {
                AnimationFlag = true;
                setTimeout(update, 0);
                d3.select(this).html("stop");
            }
            else {
                AnimationFlag = false;
                d3.select(this).html("start");
            }
        });
    //选择年份
    tr = tbody.append("tr");
    tr.append("td")
        .html("year:")
    var yearSel = tr.append("td").append("select")
        .attr("id","yearSel")
        .on("change",modifyCircles);
    yearSel.append("option")
                .html("All");
    for (var i = 2000; i <= 2014; i++)
    {
        yearSel.append("option")
            .html(i);
    }
    //选择组织
    tr = tbody.append("tr");
    tr.append("td")
        .html("organization")
    var orgaSel = tr.append("td").append("select")
        .attr("id", "orgaSel")
        .on("change", modifyCircles);
    orgaSel.append("option")
                .html("All");
    for (var p in organization) {
        orgaSel.append("option")
            .html(organization[p].gname);
    }
}

function transStackData(data)
{
    var type = [ "Taliban",    "Al-Shabaab",    "Islamic State of Iraq and the Levant (ISIL)",    "Communist Party of India - Maoist (CPI-Maoist)",    "Boko Haram", "other"];
    var rs = new Array();
    for (var t in type)
    {
        var k = new Object();
        k["name"] = type[t];
        k["data"] = new Array();
        for (var p in data)
        {
            var d = data[p];
            var o = new Object();
            o["year"] = d.iyear;
            o["amount"] = parseFloat(d[type[t]]);
            o["name"] = type[t];
            k["data"].push(o);
        }
        rs.push(k);
    }
    return rs;

    //var injure = new Object();
    //injure["name"] = "woundus";
    //injure["data"] = new Array();
    //for (var p in data)
    //{
    //    var d = data[p];
    //    var o = new Object();
    //    o["year"] = d.iyear;
    //    o["amount"] = d.nwounds;
    //    injure["data"].push(o);
    //}
    //rs.push(injure);

}

function drawStack(svg,dataSet)
{
    var width = svg.attr("width");
    var height = svg.attr("height");
    dataSet = transStackData(dataSet);
    var Stack = d3.layout.stack()
        .values(function (d) { return d.data; })
        .x(function (d) { return d.year; })
        .y(function (d) { return d.amount; });
    var Data = Stack(dataSet);
    var padding = { left: 0, right: 0, top: 30, bottom: 30 };
    var xRangeWidth = width - padding.left - padding.right;
    var xScale = d3.scale.ordinal()
        .domain(Data[0].data.map(function (d) {
            return d.year;
        }))
        .rangeBands([0, xRangeWidth], 0.3);
    //var xScale = d3.scale.ordinal()
    //.domain([2000,2001,2002,2003,2004,2005,2006])
    //.range([10,20,30,40,50,60,70]);
    var maxAmount = d3.max(Data[Data.length - 1].data, function (d) {
        return d.y0 + d.y;
    });
    var yRangeWidth = height - padding.top - padding.bottom;
    var yScale = d3.scale.linear()
        .domain([0, maxAmount])
        .range([0, yRangeWidth]);
    var color = d3.scale.category10();
    var groups = svg.selectAll("g")
        .data(Data)
        .enter()
        .append("g")
        .style("fill", function (d, i) {
            return gcolor[d.name];
        })
    var rects = groups.selectAll("rect")
        .data(function (d) {
            return d.data;
        })
        .enter()
        .append("rect")
        .attr("class", function (d,i) {
            return "stackrect"
        })
        .attr("x", function (d) {
            return xScale(d.year);
        })
        .attr("y", function (d) {
            return yRangeWidth - yScale(d.y0 + d.y);
        })
        .attr("width", function (d) {
            return xScale.rangeBand();
        })
        .attr("height", function (d) {
            return yScale(d.y);
        })
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
        .on("mouseover", function (d) {
                mark(d.name, d.year)
            })
        .on("mouseout", recover);
    
    //绘制坐标轴
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickFormat(d3.format(".0f"));
    svg.append("g")
        .attr("class","axis")
        .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
        .call(xAxis);
}

function mark(orga,year)
{
    var strokecolor = "black";
    var strokewidth = "3px";
    var div = d3.select("#statisDIV");
    var arcs = div.selectAll(".piearc");
    arcs.each(function (d) {
        if (d.data.gname == orga)
            d3.select(this)
                .style("stroke", strokecolor)
                .style("stroke-width",strokewidth);
    });
    var rects = div.selectAll("rect");
    if (year == "All") {
        rects.each(function (d) {
            if (d.name == orga)
                d3.select(this)
                    .style("stroke", strokecolor)
                    .style("stroke-width", strokewidth);
        });
    }
    else {
        rects.each(function (d) {
            if (d.name == orga && d.year == year)
                d3.select(this)
                    .style("stroke", strokecolor)
                    .style("stroke-width", strokewidth);
        });
    }

    var highcolor = "rgba(230,0,0,0.2)";
    var circles = d3.select("#circleGroup").selectAll("circle");
    //circles.each(function (d) {
    //    if (d.gname !== orga)
    //    {
    //        d3.select(this).style("opacity", 0);
    //        return;
    //    }
    //    if (year != "All" && d.iyear != year)
    //    {
    //        d3.select(this).style("opacity", 0);
    //        return;
    //    }
    //    if (d.gname == orga)
    //        d3.select(this).style("fill", highcolor);
    //});
}

function recover()
{
    var strokecolor = "rgba(255, 255, 255, 0.6)";
    var strokewidth = "1.5px";
    var div = d3.select("#statisDIV");
    var arcs = div.selectAll(".piearc")
                .style("stroke", strokecolor)
                .style("stroke-width", strokewidth);
    var rects = div.selectAll("rect")
                    .style("stroke", strokecolor)
                    .style("stroke-width", strokewidth);
    var circles = d3.select("#circleGroup").selectAll("circle");
    //circles.each(function (d) {
    //    d3.select(this).style("fill", circleStyle.color)
    //        .style("opacity",1);
    //});
}

function drawPie(svg, dataset)
{
    var width = svg.attr("width");
    var height = svg.attr("height");
    //画饼图
    var pie = d3.layout.pie()
        .value(function (d) {
            return d.amount;
        });
    var piedata = pie(dataset);
    var outerRadius = height / 2.5;
    var innerRadius = 0;
    var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
    var color = d3.scale.category10();
    var arcs = svg.selectAll("g")
        .data(piedata)
        .enter()
        .append("g")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");
    arcs.append("path")
        .attr("class", "piearc")
        .attr("fill", function (d, i) {
            return gcolor[d.data.gname];
        })
        .attr("d", function (d) {
            return arc(d);
        })
        .on("mouseover", function (d) {
            mark(d.data.gname, "All");
        })
        .on("mouseout", function(d){
            recover();
        });
}

function _drawStatistics(casualties,count,pieCasual,pieCount)
{
    var width = 1000;
    var height = 650;
    var div = d3.select("body")
          .append("div")
          .attr("id", "statisDIV")
          .attr("class", "statisDIV")
          .style("width", width + "px")
          .style("height",height + "px");
    gmIDs.push("statisDIV");
    //table
    var table = div.append("table")
        .style("text-align", "center")
        .style("table-layout", "fixed")
        .style("position", "absolute")
        .style("top", "1.5%")
        .style("left", "1.5%")
        .style("width", "97%")
        .style("height","97%");
    var tbody = table.append("tbody")
    //.style("table-layout", "fixed")
    //.style("position", "relative")
    //.style("top", "10%");
    //.style("left", "1.5%")
    //.style("width", "97%");
    var base = 2.1;
    //堆叠图
    var tr = tbody.append("tr");
        //数量
    svg = tr.append("td").append("svg")
        .attr("width", width / base)
        .attr("height", height / base)
        .style("background-color", "white");
    drawStack(svg, count);
        //伤亡
    var svg = tr.append("td").append("svg")
        .attr("width", width/base)
        .attr("height", height/base)
        .style("background-color", "white");
    //var casDIV = div.append("div")
    //    .style("position", "relative")
    //    //.style("left", 0)
    //    //.style("top",0)
    //    .style("width", width/2+"px")
    //    .style("height", height/2+"px");
    drawStack(svg, casualties);
  
    //饼图
    tr = tbody.append("tr");
        //数量
    svg = tr.append("td").append("svg")
        .attr("width", width / base)
        .attr("height", height / base)
        .style("background-color", "white");
    drawPie(svg, pieCount);
        //伤亡
    svg = tr.append("td").append("svg")
        .attr("width", width / base)
        .attr("height", height / base)
        .style("background-color", "white");
    drawPie(svg, pieCasual);
    //div.append("div")
    //.attr("id", "tlp")
    //.attr("class", "toolDIV");
}

function _drawGlobalMap()
{
    var mapName = "world";
    var svg = d3.select("#"+svgID);
    var width = svg.attr("width");
    var height = svg.attr("height");
    var tooltip1 = d3.select("#" + t1ID).style("left", -1000 + "px")
                                        .style("top", -1000 + "px")
                                        .style("opacity", 0.0);
    var tooltip_event = d3.select("#" + t2ID).style("left", -1000 + "px")
                                        .style("top", -1000 + "px")
                                        .style("opacity", 0.0);
    var button_return = d3.select("#" + breturnID)
                           .style("opacity", 0.0);
    var groups = svg.append("g")
        .attr("id", "mapGroup");
    gmIDs.push("mapGroup");
    d3.json("./data/mapData.json",function(error, data){
        if (error) return console.error(error);
        var mapData=data[mapName];
        var pro=mapData.projection;
        var scaleV=mapData.scale;
        var center0=mapData.center0;
        var center1 = mapData.center1;
        var global = mapData.global;
        var projection = d3.geo.equirectangular();
        projection.center([center0, center1])
    		  .scale(scaleV)
    		  .translate([width/2.4, height/2.3]);	
        var path = d3.geo.path()
				    .projection(projection);
        d3.csv("./data/incident/world_inc.csv", function (error, incidents) {
               if (error) return console.error(error);               
               d3.csv("./data/eventCountry.csv", function (error, eventCountries) {
                   if (error) return console.error(error);
                   var Areas = new Object();
                   for (var p in eventCountries)
                   {
                       Areas[eventCountries[p]["country"]]=true;
                   }
                   d3.json("./data/map/world.geojson", function (error, root) {
                       if (error) return console.error(error);
                       //绘制地图
                       var paths = groups.selectAll("path")
                            .data(root.features)
                            .enter()
                            .append("path")
                            .attr("class", "area")
                            .attr("stroke", "#ffffff")
                            .attr("stroke-width", 1)
                            .style("fill", function (d, i) {
                                if (!(Areas.hasOwnProperty(d.properties.name))) {
                                    return "#d7d7ea";
                                }
                                else
                                {
                                    return "#a5a6c9";
                                }
                            })
                            .attr("d", path)
                            .style("cursor", function (d, i) {
                                if (Areas.hasOwnProperty(d.properties.name))
                                    return "pointer";
                                else
                                    return "default";
                            });
                       //增加区域监听事件
                       paths.on("mouseover", function (d, i) {
                           if (Areas.hasOwnProperty(d.properties.name))
                           {
                               d3.select(this).style("fill", "#756bb1");
                           }
                           tooltip1.style("left", (d3.event.pageX) + "px")
                                   .style("top", (d3.event.pageY + 20) + "px")
                                   .style("opacity", 0.75)
                                   .html(d.properties.name);
                       })
                       .on("mouseout", function (d, i) {
                           if (!(Areas.hasOwnProperty(d.properties.name)))
                               d3.select(this).style("fill","#d7d7ea");
                           else
                               d3.select(this).style("fill","#a5a6c9");
                           tooltip1.style("left", -1000 + "px")
                               .style("top", -1000 + "px")
                               .style("opacity", 0.0);
                       })
                       .on("mousemove", function (d) {
                           tooltip1.style("left", (d3.event.pageX) + "px")
                                 .style("top", (d3.event.pageY + 20) + "px");
                       })
                       .on("click", function (d, i) {
                           if (Areas.hasOwnProperty(d.properties.name ))
                           {
                               clearTAGS();
                               drawMap(svgID,d.properties.name,t1ID,breturnID); 
                           }      
                       });
                       //增加事件点
                       circleStyle["size"] = mapData.circleSize1;
                       var circleGroup = groups.append("g")
                                       .attr("id", "circleGroup");
                       circleGroup.selectAll("circle")
                                  .data(incidents)
                                  .enter()
                                  .append("circle")
                                  .attr("r", circleStyle.size + "px")
                                  .attr("id", function (d, i) {
                                      return d["eventid"];
                                  })
                                  .attr("class", function (d, i) {
                                      return "normalCir";
                                      //if (!d["gname"])
                                      //    return "other";
                                      //if (gname.hasOwnProperty(d["gname"])) {
                                      //    return gname[d["gname"]];
                                      //}
                                      //else
                                      //    return "other";
                                  })
                                  .style("fill",circleStyle.color)
                                  .each(function (d) {
                                      var px = projection([d["longitude"], d["latitude"]]);
                                      d3.select(this).attr("cx", px[0]);
                                      d3.select(this).attr("cy", px[1]);
                                     // console.log(d["gname"]);
                                  })
                                  .on("mouseover", function (d, i) {
                                  });
                       d3.select("body")
                            .style("cursor", "default");
                       //for (var pA in incidents) {
                       //    var pinc = eventAreas[pA];
                       //    for (var pE in pinc) {
                       //        var circles = circleGroup.append("g")
                       //                        .datum(pArea[pE]);
                       //        var px = projection(pArea[pE].location);
                       //        circles.append("circle")
                       //                .datum(px)
                       //                .attr("id", pArea[pE].eventID + "Circle1")
                       //                .attr("cx", px[0])
                       //                .attr("cy", px[1])
                       //                .attr("r", mapData.circleSize1 + "px")
                       //                .style("fill", "#cd5c5c")
                       //                .style("opacity", 1);                      
                       //    }
                       //}                
                   });
                });                      
        });   
    });  
} 