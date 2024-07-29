// Scene 1: Global Happiness Trends
function drawScene1(data) {
    d3.select("#scene1").selectAll("svg").remove();

    const svg = d3.select("#scene1").append("svg")
        .attr("width", 1200)
        .attr("height", 800);

    const margin = { top: 20, right: 30, bottom: 50, left: 70 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    const x = d3.scaleTime()
        .domain(d3.extent(data, d => new Date(d['year'])))
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([d3.min(data, d => +d['Life Ladder']), d3.max(data, d => +d['Life Ladder'])])
        .nice()
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    // Add X axis label
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 30)
        .text("Year");

    // Add Y axis label
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "middle")
        .attr("x", -height / 2)
        .attr("y", margin.left - 60)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Life Ladder");

    const line = d3.line()
        .x(d => x(new Date(d['year'])))
        .y(d => y(+d['Life Ladder']))
        .curve(d3.curveMonotoneX);

    const countries = Array.from(new Set(data.map(d => d['Country name'])));
    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(countries);

    const paths = svg.selectAll(".line")
        .data(d3.group(data, d => d['Country name']).values())
        .join("path")
        .attr("class", "line")
        .attr("d", d => line(d))
        .attr("fill", "none")
        .attr("stroke", d => color(d[0]['Country name']))
        .attr("stroke-width", 1.5);

    // Tooltip setup
    const tooltip = d3.select("#tooltip");

    paths.on("mouseover", function(event, d) {
        d3.select(this).attr("stroke-width", 3);
        d3.selectAll(".line").classed("dimmed", true);
        d3.select(this).classed("dimmed", false);
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(`Country: ${d[0]['Country name']}`)
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
    }).on("mouseout", function() {
        d3.select(this).attr("stroke-width", 1.5);
        d3.selectAll(".line").classed("dimmed", false);
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

    // Add annotations
    const annotationGroup = svg.append("g")
        .attr("class", "annotation-group");

    // Finland annotation
    if (countries.includes("Finland")) {
        annotationGroup.append("text")
            .attr("x", width - 250) // Position off to the right
            .attr("y", 40) // Adjust vertical position to be under the search bar
            .attr("class", "annotation")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .text("Happiest Country");

        annotationGroup.append("text")
            .attr("x", width - 250) // Position off to the right
            .attr("y", 60) // Adjust vertical position
            .attr("class", "annotation")
            .attr("font-size", "12px")
            .text("Finland has been ranked");

        annotationGroup.append("text")
            .attr("x", width - 250) // Position off to the right
            .attr("y", 80) // Adjust vertical position
            .attr("class", "annotation")
            .attr("font-size", "12px")
            .text("as the happiest country.");
    }

    // Afghanistan annotation
    if (countries.includes("Afghanistan")) {
        annotationGroup.append("text" )
            .attr("x", margin.left + 700) // Position to the left
            .attr("y", height - margin.bottom - 80) // Adjust vertical position to be near the bottom
            .attr("class", "annotation")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .text("Least Happy Country");

        annotationGroup.append("text")
            .attr("x", margin.left + 700) // Position to the left
            .attr("y", height - margin.bottom - 60) // Adjust vertical position
            .attr("class", "annotation")
            .attr("font-size", "12px")
            .text("Afghanistan has been ranked");

        annotationGroup.append("text")
            .attr("x", margin.left + 700) // Position to the left
            .attr("y", height - margin.bottom - 40) // Adjust vertical position
            .attr("class", "annotation")
            .attr("font-size", "12px")
            .text("as the least happy country.");
    }
}
