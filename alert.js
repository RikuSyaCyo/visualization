$.jAlert({
	'title':'HOW TO USE',
	'size':'lg',
	'image':'pic/How_to_Use_01.png',
	'btns':[{'text':'1', 'closeAlert':false, 'theme': 'black' ,'onClick':function(){d3.selectAll(".ja_img")
	                                            .attr("src","pic/How_to_Use_01.png");}},
	        {'text':'2', 'closeAlert':false, 'theme': 'black' ,'onClick':function(){d3.selectAll(".ja_img")
	                                            .attr("src","pic/How_to_Use_02.png");}}],
	'type':'tooltip'
});
