var eventArea=d3.set(["新疆","西藏","云南","China","France"]);
var dataset={"新疆":"2009.07.05打砸抢暴力犯罪事件",
                "西藏":"2008.03.14拉萨打砸抢暴力犯罪事件",
                "云南":"2014.03.01昆明火车站暴恐案"
};
var t2ID = "tooltip_event";
var orgName=new Array("Al-Qa`ida","Islamic State of Iraq and the Levant (ISIL)","Al-Qa`ida in the Arabian Peninsula (AQAP)","Eastern Turkistan Islamic Movement (ETIM)","Al-Nusrah Front");
var flag={
    "Al-Qa`ida":false,
    "Islamic State of Iraq and the Levant (ISIL)":false,
    "Al-Qa`ida in the Arabian Peninsula (AQAP)":false,
    "Eastern Turkistan Islamic Movement (ETIM)":false,
    "Al-Nusrah Front":false
};
var orgID=new Array("alq","ISIL","AQAP","ETIM","aln");
var orgbutton=0;
var atkbutton=0;
var color=new Array("#cb2e26","#83c3eb","#f1bd56","#0060a7","#87bb40");
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

      d3.select("#buttonTable")
        .style("opacity",1.0);
      d3.select("#atkimg")
        .style("opacity",1.0);
      d3.select("#tagimg")
        .style("opacity",1.0);
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
             d3.selectAll("#buttonTable")
               .style("opacity",1);
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
                var defs=svg.append("defs");
                     var gaussian=defs.append("filter")
                                      .attr("id","gaussian");
                     gaussian.append("feGaussianBlur")
                            .attr("in","SourceGraphic")
                            .attr("stdDeviation","1");

                 circleGroups.each(function (d) {
                     var px = projection([d["longitude"], d["latitude"]]);
                     var group = d3.select(this);
                     
                     group.append("circle")
                              .attr("id", "C0"+d.eventid)
                              .attr("cx", px[0])
                              .attr("cy", px[1])
                              .attr("r", mapData.circleSize0 + "px")
                              .style("fill", "#fff3f1")
                              .style("opacity", 0.75)
                              .style("filter","url(#gaussian)");
                     group.append("circle")
                             .attr("id", "C1"+d.eventid)
                             .attr("cx", px[0])
                             .attr("cy", px[1])
                             .attr("r", mapData.circleSize1 + "px")
                             .style("fill", "#ff867d")
                             .style("opacity", 1);
                             
                     group.on("mouseover", function (d) {
                          var wd = d["nwound"];
                          var kill = d["nkill"];
                          if (!(wd) )
                             wd = 0;
                          if (!(kill))
                              kill = 0;
                          var base = mapData.base;
                          var sz = parseInt(wd) + parseInt(kill);
                          if (sz > base * 15)
                              sz = base * 15;
                          var circlesize0 = mapData.circleSize0*(1+sz/base);
                          var circlesize1 = mapData.circleSize1*(1+sz/base);
                         // var circlesize0 = mapData.circleSize0 * 1.5;
                         // var circlesize1 = mapData.circleSize1 * 1.4;
                          var circle0 = d3.select("#" + "C0" + d.eventid)
                                              .transition().duration(800)
                                              .ease("elastic")
                                              .attr("r", circlesize0 + "px")
                                              .style("opacity", 0.6);
                          var circle1 = d3.select("#" + "C1" + d.eventid)
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
                                                 .attr("r", mapData.circleSize0 + "px")
                                                 .style("opacity", 1);;
                             var circle1 = d3.select("#" + "C1"+d.eventid)
                                                 .transition().duration(80)
                                                 .attr("r", mapData.circleSize1 + "px")
                                                 .style("opacity", 1);;
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
                    
                 });

                     //组织筛选
                     for(var p in orgName)
                     {
                        d3.select("#"+orgID[p])
                          .datum(orgName[p])
                          .on("click",function(d){
                            if(flag[d]==false)
                            {
                                for(var i in incidents)
                                {

                                    if (incidents[i]["gname"]!=d)
                                    {
                                       //console.log(d3.select("#C0"+incidents[i].eventid).style("fill"));
                                        if(d3.select("#C0"+incidents[i].eventid).style("fill")=="rgb(255, 243, 241)")
                                        {
                                             d3.select("#C0"+incidents[i].eventid)
                                               .style("fill","none");
                                             d3.select("#C1"+incidents[i].eventid)
                                               .style("fill","none");
                                        }
                                        
                                    }
                                    else if (incidents[i]["gname"]==d)
                                    {
                                        // d3.select("#C0"+incidents[i].eventid)
                                        //   .style("fill",color[orgbutton]);
                                        d3.select("#C1"+incidents[i].eventid)
                                          .style("fill",color[orgbutton])
                                          .style("opacity",1.0);
                                        d3.select("#C0"+incidents[i].eventid)
                                          .style("fill","white")
                                          .style("opacity",1.0);
                                         //console.log(incidents[i].eventid);
                                    }
                            
                                }
                                flag[d]=true;
                                orgbutton++;
                                //console.log(orgbutton); 
                            }
                            else{
                                flag[d]=false;
                                orgbutton--;
                                for(var i in incidents)
                                {

                                    if((incidents[i]["gname"]!=d)&&(orgbutton==0))
                                    {
                                        d3.select("#C0"+incidents[i].eventid)
                                          .style("fill","rgb(255, 243, 241)")
                                          .style("opacity",1.0);
                                        d3.select("#C1"+incidents[i].eventid)
                                          .style("fill","rgb(255, 134, 125)")
                                          .style("opacity",1.0);
                                    }
                                    else if (incidents[i]["gname"]==d)
                                    {
                                        d3.select("#C0"+incidents[i].eventid)
                                          .style("fill","none");
                                        d3.select("#C1"+incidents[i].eventid)
                                          .style("fill","none");
                                    }
                                } 
                                
                            }
                            
                          })
                     }

                     //攻击类型筛选
                     d3.select("#atkButton")
                       .on("click",function()
                       {
                        if(atkbutton==0)
                        {
                            for(var p in incidents)
                            {
                                var thisevent=d3.select("#C0"+incidents[p].eventid).style("fill");
                                //console.log(thisevent);
                                if(thisevent!="none")
                                {
                                    
                                    switch(incidents[p]["attacktype1"]){
                                        case "1":
                                        //onsole.log(incidents[p]["attacktype1"]);
                                          d3.select("#C1"+incidents[p].eventid)
                                            .style("fill","#66cccc");
                                            break;
                                        case "2":
                                          d3.select("#C1"+incidents[p].eventid)
                                            .style("fill","99cc33");
                                            break;
                                        case "3":
                                          d3.select("#C1"+incidents[p].eventid)
                                            .style("fill","#ff6600");
                                            break;
                                        case "4":
                                          d3.select("#C1"+incidents[p].eventid)
                                            .style("fill","#ffbfbf");
                                            break;
                                        case "5":
                                          d3.select("#C1"+incidents[p].eventid)
                                            .style("fill","#666699");
                                            break;
                                        case "6":
                                          d3.select("#C1"+incidents[p].eventid)
                                            .style("fill","#ffff99");
                                            break;
                                        case "7":
                                          d3.select("#C1"+incidents[p].eventid)
                                            .style("fill","#cc99cc");
                                            break;
                                        case "8":
                                          d3.select("#C1"+incidents[p].eventid)
                                            .style("fill","#e1657d");
                                            break;
                                        default: break;
                                    }
                                }
                            }
                            atkbutton=1;
                        }
                        else if(atkbutton==1)
                        {
                            for(var p in incidents)
                            {
                                var thisevent=d3.select("#C0"+incidents[p].eventid).style("fill");
                                //console.log(thisevent);
                                if(thisevent!="none")
                                {
                                    d3.select("#C0"+incidents[p].eventid)
                                          .style("fill","rgb(255, 243, 241)")
                                          .style("opacity",1.0);
                                        d3.select("#C1"+incidents[p].eventid)
                                          .style("fill","rgb(255, 134, 125)")
                                          .style("opacity",1.0);
                                }
                            }
                            atkbutton=0;
                        }
                       })
                    // d3.select("#tagButton")
                    //   .on("click",function()
                    //   {
                    //     for(var p in incidents)
                    //     {
                    //         //console.log(incidents[p].targtype1);
                    //         var px = projection([incidents[p]["longitude"], incidents[p]["latitude"]]);
                    //         //console.log(px);
                    //         svg.append("text")
                    //           .html(incidents[p].targtype1)
                    //           .attr("x",px[0])
                    //           .attr("y",px[1]);
                    //     }
                    //   })

                    //伤亡堆栈图
                    var yearkill=new Array(); //年死亡人数  
                    var yearwd=new Array(); //年受伤人数
                    for(var i=0;i<15;i++)
                    {
                        yearkill[i]=0;
                        yearwd[i]=0;
                    }
                    var dataset=new Array();
                    for(var p in incidents)
                    {
                        var wd=parseInt(incidents[p].nwound);
                        var kill=parseInt(incidents[p].nkill);
                        //console.log(yearkill[14]);
                        if ((wd == "")||isNaN(wd))
                            wd = 0;
                         if ((kill == "")||isNaN(kill))
                            kill = 0;
                        yearkill[incidents[p].iyear-2000]+=kill;
                        yearwd[incidents[p].iyear-2000]+=wd;
                        //console.log(yearkill[14]);
                    }
                    //console.log(yearkill);
                    //console.log(yearwd);
                    dataset[0]=new Object();
                    dataset[1]=new Object();
                    dataset[0].name="kill";
                    dataset[0].number=new Array();
                    dataset[1].name="injured";
                    dataset[1].number=new Array();
                    //console.log(dataset);
                    for(var i in yearwd)
                    {
                        dataset[0].number[i]=new Object();
                        dataset[0].number[i].year=parseInt(i)+2000;
                        dataset[0].number[i].count=yearkill[i];

                        dataset[1].number[i]=new Object();
                        dataset[1].number[i].year=parseInt(i)+2000;
                        dataset[1].number[i].count=yearwd[i];
                    }
                    var stack=d3.layout.stack()
                                .values(function(d){return d.number;})
                                .x(function(d){return d.year;})
                                .y(function(d){return d.count;});
                    var data=stack(dataset);
                    //console.log(data);
                    var padding={left:1500,right:30,top:350,bottom:500};
                    var xRangWidth=width-padding.left-padding.right;
                    var xScale=d3.scale.ordinal()
                                .domain(data[0].number.map(function(d){
                                    return d.year;
                                }))
                                .rangeBands([0,xRangWidth],0.3);
                    var maxCount=d3.max(data[data.length-1].number,function(d){
                        return d.y0+d.y;
                    });
                    var yRangeWidth=height-padding.top-padding.bottom;
                    var yScale=d3.scale.linear()
                                 .domain([0,maxCount])
                                 .range([0,yRangeWidth]);
                    var stackcolor=new Array("#FF99CC","#CCCCFF");
                    var stackgroups=svg.append("g")
                                    .attr("id","stackgroup")
                                    .selectAll("g")
                                    .data(data)
                                    .enter()
                                    .append("g")
                                    .style("fill",function(d,i){return stackcolor[i];});
                    var stacktooltip=d3.select("body")
                                         .append("div")
                                         .attr("id","stacktooltip")
                                         .attr("class","tooltip");
                    var rects=stackgroups.selectAll("rect")
                                    .data(function(d){return d.number;})
                                    .enter()
                                    .append("rect")
                                    .attr("x",function(d){return xScale(d.year);})
                                    .attr("y",function(d){
                                        return yRangeWidth-yScale(d.y0+d.y);
                                    })
                                    .attr("width",function(d){
                                        return xScale.rangeBand();
                                    })
                                    .attr("height",function(d){return yScale(d.y);})
                                    .attr("transform","translate("+padding.left+","+padding.top+")")
                                    .on("mouseover",function(d){
                                      //console.log(d.count);
                                      stacktooltip.style("left", (d3.event.pageX) + "px")
                                         .style("top", (d3.event.pageY+10) + "px")
                                         .style("opacity", 0.75)
                                         .html(d.count);
                                    })
                                    .on("mouseout",function(d,i){
                                      stacktooltip.style("opacity",0.0);
                                    });

                    //目标类型堆栈图
                    var typetooltip=d3.select("body")
                                         .append("div")
                                         .attr("id","typetooltip")
                                         .attr("class","tooltip");
                    var type=new Array();
                    for(var i=0;i<15;i++)
                    {
                        type[i]=new Array();
                        for(var j=0;j<22;j++)
                        {
                            type[i][j]=0;
                        }
                    }
                   
                    for(var p in incidents)
                    {
                        type[incidents[p].iyear-2000][incidents[p].targtype1-1]+=1;
                        //console.log(incidents[p].targtype1);
                    }
                    var typegroups=svg.append("g")
                                    .attr("id","typegroup")
                    var x=1508;
                    var y=630;

                    for(var i=0;i<15;i++)
                    {
                        for(var j=0;j<22;j++)
                        {
                            var color_now=204-type[i][j]*30;
                            if(color_now==0) color_now=0;
                            var typecolor="rgb("+color_now+","+color_now+",255)";
                            y-=7;
                            var rect_now=new Object();
                            rect_now.type=j;
                            rect_now.count=type[i][j];
                            rect_now.year=i;
                            //console.log(type[recordi][recordj]);
                            typegroups.append("rect")
                                    .style("fill",typecolor)
                                    .attr("id","rect"+i+j)
                                    .attr("x",x+"px")
                                    .attr("y",y+"px")
                                    .attr("width","20px")
                                    .attr("height","5px")
                                    .datum(rect_now)
                                    .on("mouseover",function(d){
                                      console.log(d);
                                      d3.select("#rect"+d.year+d.type)
                                        .style("stroke","black")
                                        .style("stroke-width","1")
                                        .transition()
                                        .duration(800)
                                        .ease("elastic")
                                        .attr("width","23px")
                                        .attr("height","10px");
                                      typetooltip.style("left", (d3.event.pageX) + "px")
                                         .style("top", (d3.event.pageY + 10) + "px")
                                         .style("opacity", 0.75)
                                         .style("font-size","5px")
                                         .html("type:"+d.type+"<br>"+"count:"+d.count);
                                    })
                                    .on("mouseout",function(d){
                                      d3.select("#rect"+d.year+d.type)
                                        .style("stroke-width","0")
                                        .transition()
                                        .duration(800)
                                        .ease("elastic")
                                        .attr("width","20px")
                                        .attr("height","5px");
                                      typetooltip.style("opacity",0.0);
                                    })
                        }
                        x+=24;
                        y=630;
                    }

                    //攻击类型堆栈图
                    var atk=new Array();
                    for(var i=0;i<15;i++)
                    {
                        atk[i]=new Array();
                        for(var j=0;j<9;j++)
                        {
                            atk[i][j]=0;
                        }
                    }
                    var atkdataset=new Array();
                    for(var p in incidents)
                    {
                        atk[incidents[p].iyear-2000][incidents[p].attacktype1-1]+=1;
                    }
                    for(var i=0;i<9;i++)
                    {
                        atkdataset[i]=new Object();
                        atkdataset[i].type=i+1;
                        atkdataset[i].number=new Array();
                        for(var j=14;j>=0;j--)
                        {
                            atkdataset[i].number[14-j]=new Object();
                            atkdataset[i].number[14-j].year=j+2000;
                            atkdataset[i].number[14-j].count=atk[j][i];
                        }
                    }
                    var atkstack=d3.layout.stack()
                                   .values(function(d){return d.type;})
                                   .x(function(d){return d.year;})
                                   .y(function(d){return d.count;});
                    var atkdata=stack(atkdataset);
                   // console.log(atkdata);
                    var atkpadding={left:1500,right:30,top:650,bottom:200};
                    var atkxRangWidth=width-atkpadding.left-atkpadding.right;
                    var atkxScale=d3.scale.ordinal()
                                .domain(atkdata[0].number.map(function(d){
                                    return d.year;
                                }))
                                .rangeBands([0,atkxRangWidth],0.3);
                    var atkmaxCount=d3.max(atkdata[atkdata.length-1].number,function(d){
                        return d.y0+d.y;
                    });
                    var atkyRangeWidth=height-atkpadding.top-atkpadding.bottom;
                    var atkyScale=d3.scale.linear()
                                 .domain([0,atkmaxCount])
                                 .range([0,atkyRangeWidth]);
                    var atkcolor=new Array("#66cccc","#99cc33","#ff6600","#ffbfbf","#666699","#ffff99","#cc99cc","#e1657d","#ff867d");
                    var atkgroups=svg.append("g")
                                    .attr("id","atkgroup")
                                    .selectAll("g")
                                    .data(atkdata)
                                    .enter()
                                    .append("g")
                                    .style("fill",function(d,i){return atkcolor[i];});
                    var atkrects=atkgroups.selectAll("rect")
                                    .data(function(d){return d.number;})
                                    .enter()
                                    .append("rect")
                                    //.attr("class","atkgroup")
                                    .attr("x",function(d){return atkxScale(d.year);})
                                    .attr("y",function(d){
                                        return atkyRangeWidth-atkyScale(d.y0+d.y);
                                    })
                                    .attr("width",function(d){
                                        return atkxScale.rangeBand();
                                    })
                                    .attr("height",function(d){return atkyScale(d.y);})
                                    .attr("transform",function(d){
                                        return "translate("+atkpadding.left+","+atkpadding.top+")"+"rotate(180,185 53)";
                                    })
                                    .on("mouseover",function(d){
                                      //console.log(d);
                                      stacktooltip.style("left", (d3.event.pageX) + "px")
                                         .style("top", (d3.event.pageY + 10) + "px")
                                         .style("opacity", 0.75)
                                         .html(d.count);
                                    })
                                    .on("mouseout",function(d,i){
                                      stacktooltip.style("opacity",0.0);
                                    });

                    //坐标轴
                    var axScale=d3.scale.linear()
                                  .domain([2000,2014])
                                  .range([0,385]);
                    var axis=d3.svg.axis()
                                .scale(axScale)
                                .orient("top")
                                .tickValues([2000,2014]);
                    var gAxis=svg.append("g")
                                 .attr("transform","translate(1493,635)");
                    gAxis.attr("class","axis")
                         .attr("id","axis");
                    axis(gAxis);

                    //标注
                    var gradient=defs.append("linearGradient")
                                      .attr("id","myGradient")
                                      .attr("x1","0%")
                                      .attr("x2","0%")
                                      .attr("y1","0%")
                                      .attr("y2","100%");
                     gradient.append("stop")
                            .attr("offset","0%")
                            .attr("stop-color","rgb(0,0,255)");
                    gradient.append("stop")
                            .attr("offset","100%")
                            .attr("stop-color","rgb(204,204,255)");

                    var markgroups=svg.append("g")
                                    .attr("id","mark");

                    markgroups.append("rect")
                       .attr("fill","url(#myGradient)")
                       .attr("x","1480")
                       .attr("y","500")
                       .attr("width","20")
                       .attr("height","100");
                    markgroups.append("text")
                       .attr("x","1484")
                       .attr("y","612")
                       .text("0");
                    markgroups.append("text")
                       .attr("x","1480")
                       .attr("y","495")
                       .text("max");
                    markgroups.append("circle")
                       .attr("cx","1430")
                       .attr("cy","390")
                       .attr("r","5")
                       .attr("fill","#FF99CC");
                     markgroups.append("circle")
                       .attr("cx","1430")
                       .attr("cy","370")
                       .attr("r","5")
                       .attr("fill","#CCCCFF");
                     markgroups.append("text")
                       .attr("x","1440")
                       .attr("y","395")
                       .attr("font-size","5px")
                       .text("fatalities");
                    markgroups.append("text")
                       .attr("x","1440")
                       .attr("y","375")
                       .attr("font-size","5px")
                       .text("injuries");
                    markgroups.append("text")
                       .attr("x","1430")
                       .attr("y","750")
                       .attr("font-size","5px")
                       .text("number of incidents");

                  //返回世界地图
                  var button_return = d3.select("body")
                    .append("button")
                    .attr("id", "tooltip_return")
                    .attr("class", "button")
                    .html("←return to global")
                    .on("click", function () {
                      d3.selectAll("img")
                        .style("opacity",1.0);
                      d3.select("#printname")
                        .style("opacity",0.0);
                      d3.select("#timeline-embed")
                        .remove();
                      d3.select("#circle")
                       .style("opacity", 0.0);
                      d3.selectAll("rect")
                        .remove();
                      d3.select("#axis")
                        .remove();
                      d3.select("#mark")
                        .remove();
                      d3.select("#buttonTable")
                        .style("opacity",0.0);
                      d3.select("#atkimg")
                        .style("opacity",0.0);
                      d3.select("#tagimg")
                        .style("opacity",0.0);
                        drawGlobalMap("mapSVG", "tooltip", "tooltip_return");
                    });
                button_return.style("opacity", 1);
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