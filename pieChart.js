var pieChart = (function pieChart(data_url, selector, params){
	var margin = {top: 150, right: 10, bottom: 10, left: 150};

        if ('width' in params){
            width = params.width - margin.left - margin.right;
        }
        else{
            width = 350 - margin.left - margin.right;//400 - margin.left - margin.right;
        }

        if ('height' in params){
            height = params.height - margin.top - margin.bottom;//margin.top - margin.bottom;
        }
        else{
            height = 400 - margin.top - margin.bottom;//300 - margin.top - margin.bottom;
        }



	// set the dimensions and margins of the graph


	var radius = Math.min(width, height) / 2;

	d3.selectAll(selector + " > *").remove();

	var svg = d3.select(selector)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
	      "translate(" + margin.left + "," + margin.top + ")");

	var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	var pie = d3.pie()
        .sort(null)
        .value(function(d) { console.log(d.data); return d.data; });

	var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);

	var label = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);


        button_location = {left: 10, top: 10}

        var button_div = d3.select(selector).append("div")
        .attr("class", "chart_transition")
        .style("opacity", 1)
        .style("background", "#aaa")
        .style("position", "absolute");


	d3.json(data_url, function(error, all_data) {
		if (error) throw error;


		console.log(all_data);

                base_render(all_data, Object.keys(all_data['data'])[0]);


                if (Object.keys(all_data['data']).length > 1){

                    button_div.html("<div id='buttons' style=';position: absolute; text-align: center;  width: 500px;  height: 50px;  padding: 0px;  font: 12px sans-serif;  border: 0px;'>" +
                                    "<button id='"+Object.keys(all_data['data'])[0].replace(/\s+/g, '') +"'>"+ Object.keys(all_data['data'])[0]+"</button>" +
                                    "<button id='"+Object.keys(all_data['data'])[1].replace(/\s+/g, '') +"'>"+ Object.keys(all_data['data'])[1]+"</button>" +
                                    " </div>")
                        .style("left", button_location.left)//(d3.event.pageX - 60) + "px")

                        .style("top", button_location.top)//(d3.event.pageY - 28) + "px")  

                        .style("fill", "white");

                    d3.select("#"+Object.keys(all_data['data'])[0].replace(/\s+/g, '')).style('background-color', '#99ccee')

                        d3.select("#"+Object.keys(all_data['data'])[1].replace(/\s+/g, '')).style('background-color', '#ddd')


                        d3.select("#"+Object.keys(all_data['data'])[0].replace(/\s+/g, ''))
                        .on("click", function(d, i) {
                                d3.select("#"+Object.keys(all_data['data'])[1].replace(/\s+/g, '')).style('background-color', '#ddd')
                                    d3.select(this).style('background-color', '#99ccee');
                                base_render(all_data, Object.keys(all_data['data'])[0])
                                    });
                    d3.select("#"+Object.keys(all_data['data'])[1].replace(/\s+/g, ''))
                        .on("click", function(d, i) {
                                d3.select("#"+Object.keys(all_data['data'])[0].replace(/\s+/g, '')).style('background-color', '#ddd')
                                    d3.select(this).style('background-color', '#99ccee');
                                base_render(all_data, Object.keys(all_data['data'])[1])
                                    });


		}


		function base_render(all_data, primary_key){

		data = all_data['data'];
		title = all_data['title'];


		if (primary_key){
		    data = data[primary_key];
		}



		// set the color scale
		var color = d3.scaleOrdinal()
		    .domain(data);


		if (params.colorscheme){
                    color.range(params.colorscheme);
                }
                else{
                    color.range(d3.schemeSet2);
                }



		// Compute the position of each group on the pie:
		var pie = d3.pie()
		    .value(function(d) {return d.value; })
		    var data_ready = pie(d3.entries(data))
		    // Now I know that group A goes from 0 degrees to x degrees and so on.

		    // shape helper to build arcs:
		    var arcGenerator = d3.arc()
		    .innerRadius(0)
		    .outerRadius(radius)

		    if (params.bgcolor){
			svg.append("rect")
			.attr("x", -margin.left)
			.attr("y", -margin.top)
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("fill", params.bgcolor);
		    }



		// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
		    svg
			.selectAll('mySlices')
			.data(data_ready)
			.enter()
			.append('path')
			.attr('d', arcGenerator)
			.attr('fill', function(d){ return(color(d.data.key)) })
			.attr("stroke", "black")
			.style("stroke-width", "2px")
			.style("opacity", 0.7)

			// Now add the annotation. Use the centroid method to get the best coordinates
			svg
			.selectAll('mySlices')
			.data(data_ready)
			.enter()
			.append('text')
			.text(function(d){ return d.data.key + ': ' + Math.round(d.data.value*100,0) +'%'})
			.attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
			.style("text-anchor", "middle")
			.style("font-size", 15)




			};
	    });
    });
