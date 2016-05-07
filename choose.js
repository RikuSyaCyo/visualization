var orgOpen=0;
var atkOpen=0;
var tagOpen=0;
function chooseOrg()
{
	if(orgOpen==0)
	{
		d3.select("#orgTable")
	      .style("opacity",1.0);
	    orgOpen=1;
	}
	else if(orgOpen==1)
	{
		d3.select("#orgTable")
	      .style("opacity",0);
	    orgOpen=0;
	}
}
function chooseAtk()
{
	if(atkOpen==0)
	{
		d3.select("#atkimg")
		  .style("opacity",1.0);
		atkOpen=1;
	}
	else if(atkOpen==1)
	{
		d3.select("#atkimg")
	      .style("opacity",0);
	    atkOpen=0;
	}
}
function chooseTag()
{
    if(tagOpen==0)
	{
		d3.select("#tagimg")
		  .style("opacity",1.0);
		tagOpen=1;
	}
	else if(tagOpen==1)
	{
		d3.select("#tagimg")
	      .style("opacity",0);
	    tagOpen=0;
	}
}