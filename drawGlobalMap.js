var eventArea=d3.set(["新疆","西藏","云南","China","France"]);
var dataset={"新疆":"2009.07.05打砸抢暴力犯罪事件",
                "西藏":"2008.03.14拉萨打砸抢暴力犯罪事件",
                "云南":"2014.03.01昆明火车站暴恐案"
};
var t2ID = "tooltip_event";

function drawGlobalMap(svgID, t1ID, breturnID)
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
    		  .translate([width/2, height/2]);	
        var path = d3.geo.path()
				    .projection(projection);
        var groups=d3.select("#mapGroup");
        groups.remove();              
        groups=svg.append("g")
                .attr("id", "mapGroup");
        d3.csv("./data/incident/world_inc.csv", function (error, incidents) {
                if (error) return console.error(error);            
                svg.style("top", "0px")
                   .style("height","960px");
                d3.selectAll("img")
                  .style("opacity",1.0);
                d3.select("#printname")
                  .style("opacity",0.0);
                d3.select("#timeline-embed")
                  .remove();
                d3.select("#circle")
                  .style("opacity", 0.0);
                d3.select("#buttonTable")
                  .style("opacity",0.0);
                d3.select("#orgTable")
                  .style("opacity",0.0);
                d3.select("#atkimg")
                  .style("opacity",0.0);
                d3.select("#tagimg")
                  .style("opacity",0.0);
               d3.csv("./data/eventCountry.csv", function (error, eventCountries) {
                   if (error) return console.error(error);
                   var Areas = new Object();
                   for (var p in eventCountries)
                   {
                       Areas[eventCountries[p]["country"]]=true;
                   }
                   console.log(Areas.hasOwnProperty("Ethiopia"));
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
                            .attr("d", path);
                       //增加区域监听事件
                       paths.on("mouseover", function (d, i) {
                           if (Areas.hasOwnProperty(d.properties.name))
                           {
                               d3.select(this).style("fill","#756bb1");                  
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
                               drawMap(svgID,d.properties.name,t1ID,breturnID); 
                           }      
                       });
                       //增加事件点
                       var circleGroup = groups.append("g")
                                       .attr("id", "circleGroup");
                       circleGroup.selectAll("circle")
                                  .data(incidents)
                                  .enter()
                                  .append("circle")
                                  .each(function (d) {
                                      var px = projection([d["longitude"], d["latitude"]]);
                                      d3.select(this).attr("cx", px[0]);
                                      d3.select(this).attr("cy", px[1]);
                                  })
                                  .attr("r", mapData.circleSize1 + "px")
                                  .style("fill", "#cd5c5c")
                                  .style("opacity", 1);
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