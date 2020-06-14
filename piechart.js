var dataset = [{
                label: 'Female',
                count: 168
            }, {
                label: 'Male',
                count: 166
            }

        ];

        // Set dimensions and append svg object to the body of the graph
        var width = 360;
        var height = 360;

        var svg = d3.select('#pieChart')
            .append('svg')
            .attr("width", width + 150)
            .attr("height", height + 100)
            .append('g')
            .attr('transform', 'translate(' + (width / 1.3) + ',' + (height / 1.5) + ')');

        var radius = Math.min(width, height) / 2;
        var donutWidth = 80;
        var innerRadius = radius - donutWidth;
        var outerRadius = radius;
        var outerRadiusFinal = radius * 1.06;
        var legendRectSize = 18;
        var legendSpacing = 4;

        var color = d3.scaleOrdinal(['#ff6699', '#008ae6']);

        var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        // for animation
        var arcFinal = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadiusFinal);

        var pie = d3.pie()
            .value(function(d) {
                return d.count;
            })
            .sort(null);

        // Define tooltip
        var tooltip = d3.select('#pie-chart')
            .append('div')
            .attr('class', 'tooltip');

        tooltip.append('div')
            .attr('class', 'label');

        tooltip.append('div')
            .attr('class', 'count');

        tooltip.append('div')
            .attr('class', 'percent');

        // Draw the pie chart
        var path = svg.selectAll('g.slice')
            .data(pie(dataset))
            .enter()
            .append('svg:g')
            .attr("class", "slice")

        path.append("svg:path")
            .attr('d', arc)
            .attr('fill', function(d, i) {
                return color(d.data.label);
            })
            .attr("stroke", "white")
            .style("stroke-width", "1.8px");

        // Tooltip and arc transition
        path.on('mouseover', function(d) {
            d3.select(this).select("path").transition()
                .duration(650)
                .attr("d", arcFinal);
            var total = d3.sum(dataset.map(function(d) {
                return d.count;
            }));
            var percent = Math.round(1000 * d.data.count / total) / 10;
            tooltip.select('.label').html(d.data.label);
            tooltip.select('.count').html(d.data.count);
            tooltip.select('.percent').html(percent + '%');
            tooltip.style('display', 'block');
        });

        path.on('mouseout', function() {
            d3.select(this).select("path").transition()
                .duration(650)
                .attr("d", arc);
            tooltip.style('display', 'none');
        });

        path.on('mousemove', function(d) {
            tooltip.style('top', (d3.event.pageY + 10) + 'px')
                .style('left', (d3.event.pageX + 10) + 'px');
        });

        // Add a label to the larger arcs, translated to the arc centroid and rotated
        path.filter(function(d) {
                return d.endAngle - d.startAngle > .2;
            })
            .append("svg:text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")";
            })

        .text(function(d) {
            return d.data.count;
        });

        // Computes the label angle of an arc, converting from radians to degrees
        function angle(d) {
            var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
            return a > 90 ? a - 180 : a;
        }

        // Legend
        var legend = svg.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = height * color.domain().length / 2;
                var horz = -2 * legendRectSize;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            });

        legend.append('circle')
            .attr('cx', legendRectSize)
            .attr('cy', legendRectSize - 8)
            .attr('r', 8)
            .style('fill', color)
            .style('stroke', color);

        legend.append('text')
            .attr('x', 10 + legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d) {
                return d;
            });