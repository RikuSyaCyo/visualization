var eventArea=d3.set(["新疆","西藏","云南","China","France"]);
var dataset={"新疆":"2009.07.05打砸抢暴力犯罪事件",
                "西藏":"2008.03.14拉萨打砸抢暴力犯罪事件",
                "云南":"2014.03.01昆明火车站暴恐案"
};
var t2ID = "tooltip_event";

function drawMap(svgID,mapName,t1ID,breturnID)
{
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
     d3.json("./data/mapData.json", function (error, data) {
         if (error) return console.error(error);
         var mapData = data[mapName];
         var pro = mapData.projection;
         var scaleV = mapData.scale;
         var center0 = mapData.center0;
         var center1 = mapData.center1;
         var global = mapData.global;
         var projection = d3.geo.mercator();
         projection.center([center0, center1])
               .scale(scaleV)
               .translate([width / 2, height / 2]);
         var path = d3.geo.path()
                     .projection(projection);
         var groups = d3.select("#mapGroup");
         groups.remove();
         groups = svg.append("g")
                 .attr("id", "mapGroup");
         d3.csv("./data/incident/"+mapName+"_inc.csv", function (error, inciData) {
             if (error) return console.error(error);
             var incidents = new Array();
             var areas = new Object();
             for (var p in inciData) {
                 if (inciData[p]["country_txt"] == mapName) {
                     incidents.push(inciData[p]);
                     areas[inciData[p]["city"]] = true;
                 }
             }
             svg.style("top", "300px")
                .style("height", "813px");
             d3.selectAll("img")
               .style("opacity", 0.0);
             d3.selectAll("#printname")
               .html(mapName)
               .attr("class", "printname")
               .style("opacity", 0.9);
             var timeline = d3.select("body")
               .append("div")
               .attr("id", "timeline-embed")
               .style("height", "350px")
               .style("opacity", 1.0);
             var data = "data/mydata" + mapName + ".json";
             var additionalOptions = {
                 timenav_height: 200,
                 marker_padding: 25,
                 scale_factor: 0.5,
                 hash_bookmark: true,
                 start_at_slide: 0,
                 timenav_position: "top",
                 default_bg_color: { r: 242, g: 242, b: 242 }
             };
             timeline = new TL.Timeline('timeline-embed', data, additionalOptions);
             d3.json("./geojson/" + mapName + ".geojson", function (error, root) {
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
                        //  if (!(areas.hasOwnProperty(d.properties.name)))
                              return "#d7d7ea";
                         // else
                           //   return "#a5a6c9";
                      })
                      .attr("d", path);
                 //增加区域监听事件
                 paths.on("mouseover", function (d, i) {
                     //if (areas.hasOwnProperty(d.properties.name)) {
                     //    d3.select(this).style("fill", "#756bb1");
                     //}
                     tooltip1.style("left", (d3.event.pageX) + "px")
                             .style("top", (d3.event.pageY + 20) + "px")
                             .style("opacity", 0.75)
                             .html(d.properties.name);
                 })
                 .on("mouseout", function (d, i) {
                     //if (!(areas.hasOwnProperty(d.properties.name)))
                     //    d3.select(this).style("fill", "#d7d7ea");
                     //else
                     //    d3.select(this).style("fill", "#a5a6c9");
                     tooltip1.style("left", -1000 + "px")
                         .style("top", -1000 + "px")
                         .style("opacity", 0.0);
                 })
                 .on("mousemove", function (d) {
                     tooltip1.style("left", (d3.event.pageX) + "px")
                           .style("top", (d3.event.pageY + 20) + "px");
                 })
                 .on("click", function (d, i) {
                 });
                 //增加事件点
                 var circleGroups = groups.append("g")
                                     .attr("id", "circleGroup")
                                     .selectAll("g")
                                     .data(incidents)
                                     .enter()
                                     .append("g");
                 circleGroups.each(function (d) {
                     var px = projection([d["longitude"], d["latitude"]]);
                     var group = d3.select(this);
                     group.append("circle")
                              .attr("id", "C0"+d.eventid)
                              .attr("cx", px[0])
                              .attr("cy", px[1])
                              .attr("r", mapData.circleSize0 + "px")
                              .style("fill", "white")
                              .style("opacity", 0.75);
                     group.append("circle")
                             .attr("id", "C1"+d.eventid)
                             .attr("cx", px[0])
                             .attr("cy", px[1])
                             .attr("r", mapData.circleSize1 + "px")
                             .style("fill", "#cd5c5c")
                             .style("opacity", 1);
                     group.on("mouseover", function (d) {
                         //var wd = d["nwound"];
                         //var kill = d["nkill"];
                         //if (wd == "NaN" )
                         //    wd = 0;
                         //if (kill == "NaN")
                         //    kill = 0;
                         //var sz = wd + kill;
                         //var circlesize0 = sz *1.1 + mapData.circleSize0;
                         //var circlesize1 = sz  + mapData.circleSize1;
                         //console.log(circlesize0);
                         //console.log(circlesize1);
                         //return;
                         //var circlesize0 = 100 / 1080 * 102;
                         //var circlesize1 = 100 / 158 * 48;
                         var circlesize0 = mapData.circleSize0 * 1.5;
                         var circlesize1 = mapData.circleSize1 * 1.4;
                             var circle0 = d3.select("#" + "C0"+d.eventid)
                                                 .transition().duration(800)
                                                 .ease("elastic")
                                                 .attr("r", circlesize0 + "px");
                             var circle1 = d3.select("#" + "C1"+d.eventid)
                                                 .transition().duration(800)
                                                 .ease("elastic")
                                                 .attr("r", circlesize1 + "px");
                             tooltip1.style("left", (d3.event.pageX) + "px")
                                     .style("top", (d3.event.pageY + 20) + "px")
                                     .style("opacity", 0.75)
                                     .html(d.iyear+ "."+ d.imonth+"." + d.iday);
                         })
                         .on("mousemove", function (d) {
                             tooltip1.style("left", (d3.event.pageX) + "px")
                                     .style("top", (d3.event.pageY + 20) + "px");
                         })
                         .on("mouseout", function (d) {
                             var circle0 = d3.select("#" + "C0"+d.eventid)
                                                 .transition().duration(80)
                                                 .attr("r", mapData.circleSize0 + "px");
                             var circle1 = d3.select("#" + "C1"+d.eventid)
                                                 .transition().duration(80)
                                                 .attr("r", mapData.circleSize1 + "px");
                             tooltip1.style("left", -1000 + "px")
                                     .style("top", -1000 + "px")
                                     .style("opacity", 0.0);
                         })
                         .on("click", function (d) {
                             var tooltip_event = d3.select("#" + t2ID);
                             tooltip_event.style("left", 30 + "px")
                                     .style("top", 670 + "px")
                                     .style("opacity", 0.75)
                                     .html(d.summary);
                            // $('html, body').animate({ scrollTop: 0 }, 'slow');
                             //timeline.goToId(d.eventname);
                         });
                     button_return.style("opacity", 1);
                 });
             });
         });
     });
}

//for (var pA in eventAreas) {
//    var pArea = eventAreas[pA];
//    for (var pE in pArea) {
//        // console.log(pArea[pE]);
//        //console.log(pArea[pE].eventID);
//        var circles = circleGroup.append("g")
//                        .datum(pArea[pE]);
//        //console.log(circles);
//        var px = projection(pArea[pE].location);
//        circles.append("circle")
//               .datum(px)
//               .attr("id", pArea[pE].eventID + "Circle0")
//               .attr("cx", px[0])
//               .attr("cy", px[1])
//               .attr("r", mapData.circleSize0 + "px")
//               .style("fill", "white")
//               .style("opacity", 0.75);
//        circles.append("circle")
//                .datum(px)
//                .attr("id", pArea[pE].eventID + "Circle1")
//                .attr("cx", px[0])
//                .attr("cy", px[1])
//                .attr("r", mapData.circleSize1 + "px")
//                .style("fill", "#cd5c5c")
//                .style("opacity", 1)
//        //.on("mouseover", function () {
//        //    d3.select(this).attr("r", mapData.circleSize1 * 1.3 + "px")
//        //});
//        circles.on("mouseover", function (d) {
//            console.log(d);
//            var circlesize0 = d.injured / 1080 * 102;
//            var circlesize1 = d.dead / 158 * 48;
//            var circle0 = d3.select("#" + d.eventID + "Circle0")
//                                .transition().duration(800)
//                                .ease("elastic")
//                                .attr("r", circlesize0 + "px");
//            var circle1 = d3.select("#" + d.eventID + "Circle1")
//                                .transition().duration(800)
//                                .ease("elastic")
//                                .attr("r", circlesize1 + "px");
//            tooltip1.style("left", (d3.event.pageX) + "px")
//                    .style("top", (d3.event.pageY + 20) + "px")
//                    .style("opacity", 0.75)
//                    .html(d.time);
//            //console.log(pArea[pE].eventID);
//        })
//        .on("mousemove", function (d) {
//            tooltip1.style("left", (d3.event.pageX) + "px")
//                    .style("top", (d3.event.pageY + 20) + "px");
//        })
//        .on("mouseout", function (d) {

//            var circle0 = d3.select("#" + d.eventID + "Circle0")
//                                .transition().duration(80)
//                                .attr("r", mapData.circleSize0 + "px");
//            var circle1 = d3.select("#" + d.eventID + "Circle1")
//                                .transition().duration(80)
//                                .attr("r", mapData.circleSize1 + "px");
//            tooltip1.style("left", -1000 + "px")
//                    .style("top", -1000 + "px")
//                    .style("opacity", 0.0);
//        })
//        .on("click", function (d) {
//            var tooltip_event = d3.select("#" + t2ID);
//            tooltip_event.style("left", 30 + "px")
//                    .style("top", 670 + "px")
//                    .style("opacity", 0.75)
//                    .html(d.text);
//            $('html, body').animate({ scrollTop: 0 }, 'slow');
//            timeline.goToId(d.eventname);
//        });
//    }
//}