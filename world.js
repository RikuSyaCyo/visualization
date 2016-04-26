var width  = 700;
var height = 680;
var speed = 0.02;
var startTime = Date.now();
var currentTime = Date.now();
var country=["France","Yemen","Nigeria","Kenya","Syria"];
var count=new Array();

var title=d3.select("body")
    .select("h1")
    .attr("class","title");

var body = d3.select("body");
var svg = body.append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class","svg_position");

var tooltip=d3.select("body")
            .append("div")
            .attr("class","tooltip")
            .style("opacity",0.0);
var news=d3.select("body")
          .append("div")
          .attr("class","news")
          .style("opacity",0.0);

var projection = d3.geo.orthographic()
          .scale(250);
          
var graticule = d3.geo.graticule();

var path = d3.geo.path()
        .projection(projection);

var color = d3.scale.category20();

svg.append("text")
  .attr("id","loading")
  .attr("x",width/2)
  .attr("y",height/2)
  .text("Now Loading...");

d3.json("world_605kb.json", function(error, root) {
  if (error) 
    return console.error(error);
  console.log(root);
  
  var grid = graticule();
  
  console.log(grid);
  
  var map = svg.append("g")
         .attr("transform", "translate(" +  -100 + "," + 100 + ")");

  var n=0;
  count[n]=77;
  n++;
  for(var i=1;i<country.length;i++)
  {
    for(var k=1;k<root.features.length;k++)
    {
      if(root.features[k].properties.SOVEREIGNT==country[i])
      {
        if(root.features[k].geometry!=null) count[n++]=k;
      } 
    }
  }
  
  map.append("path")
    .datum( grid )
    .attr("id","grid_id")
    .attr("class","grid_path")
    .attr("d",path);
  
  map.selectAll(".map_path")
      .data( root.features )
      .enter()
      .append("path")
      .attr("class","map_path")
      .attr("fill",function(d,i){
        return "#bcbddc";
      })
      .attr("d", path )
      .attr("id",function(d,i)
      {
        return d.properties.SOVEREIGNT;
      })
      .on("mouseover",function(d,i){
        d3.select(this)
          .attr("fill","#756bb1");
        var ele=d3.select(this);
        //alert(d.properties.SOVEREIGNT==country[1]);
        tooltip.html(d.properties.SOVEREIGNT)
            .style("opacity",0.75)
            .style("left",(d3.event.pageX)+"px")
            .style("top",(d3.event.pageY+20)+"px")    
        }
      )
      .on("mouseout",function(d,i){
        d3.select(this)
          .attr("fill","#bcbddc");
        tooltip.style("opacity",0.0);
      })

  svg.select("#loading")
    .attr("opacity",0);
  
  var count_val=new Array();
  for(var x in count)
  {
    if(root.features[count[x]].geometry!=null) 
      count_val.push(count[x]);
  }

  for(var i=0;i<count_val.length;i++)
  {
    transition(count_val[i],i);
  }
  
  function transition(d,i)
  {
    var s="#"+country[i];
    var p=d3.geo.centroid(root.features[d]);
    var r=d3.interpolate(projection.rotate(),[-p[0],-p[1]]);

    d3.transition()
    .duration(1250)
    .each("start",function()
    {
      //alert(country[ii]);
      title.text(country[i]);
      console.log("start");
      if(i==0)
        news.html("attacked by ISIS in 2015.11.13, seriously killed 132 people at least")
            .style("opacity",1.0);
      else if(i==1)
        news.html("attacked by ISIS in 2015.3.20, seriously killed 137 people <br> and injured 350 people at least")
            .style("opacity",1.0);
      else if(i==2)
        news.html("attacked by Boko in Haram 2015.1.3, seriously killed 150-2000 people")
            .style("opacity",1.0);
      else if(i==3)
        news.html("attacked by al-Shabaab in 2015.4.2, seriously injured 147 people at least")
            .style("opacity",1.0);
      else
        news.html("attacked by ISIS in 2015.8.28, seriously injured 154 people")
            .style("opacity",1.0);
    })
    .tween("rotate",function()
    {
      console.log(d);
      return function(t)
      {
        projection.rotate(r(t));
       
        map.attr("transform", "translate(" +  -100 + "," + 100 + ")");

        map.select("#grid_id")
          .attr("d",path);
        
        map.selectAll(".map_path")
          .attr("d",path);

        map.selectAll(s)
          .attr("fill","#cd5c5c");

      }
    })
    .tween("opacity",function()
    {
      return function(t)
      {
        news.style("opacity",t*1.0)
      }
    })
    .transition()
    .each("end",function()
    {
      console.log(i)
      console.log("end");
      news.style("opacity",0.0);
      map.selectAll(s)
          .attr("fill","#bcbddc");
      if(i>0)
        transition(count_val[--i],i);
      else 
      {
        i+=4;
        transition(count_val[i],i);
      }
    })
  }
});



