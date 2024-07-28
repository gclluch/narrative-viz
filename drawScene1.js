// Scene 1: Global Happiness Trends
function drawScene1(data) {
    d3.select("#scene1").selectAll("svg").remove();
    d3.select("#scene1-controls .legend").selectAll("*").remove();

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
        .attr("text-anchor", "end")
        .attr("x", width / 2 + margin.left)
        .attr("y", height + margin.top + 20)
        .text("Year");

    // Add Y axis label
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left - 50)
        .attr("x", -margin.top - height / 2 + 20)
        .text("Life Ladder");

    const countries = Array.from(new Set(data.map(d => d['Country name'])));
    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(countries);

    const line = d3.line()
        .x(d => x(new Date(d['year'])))
        .y(d => y(+d['Life Ladder']))
        .curve(d3.curveMonotoneX);

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

    // Create Legend
    const selectedCountries = Array.from(new Set(data.map(d => d['Country name'])));
    const legend = d3.select("#scene1-controls .legend");

    if (!d3.select("#country-filter").property("value").includes("all")) {
        selectedCountries.forEach(country => {
            const legendItem = legend.append("div")
                .attr("class", "legend-item")
                .style("display", "flex")
                .style("align-items", "center")
                .style("margin-bottom", "5px");

            legendItem.append("div")
                .attr("class", "legend-color")
                .style("background-color", color(country))
                .style("width", "20px")
                .style("height", "20px")
                .style("border-radius", "50%")
                .style("margin-right", "10px");

            legendItem.append("div")
                .attr("class", "legend-text")
                .text(country);
        });
    }
}
