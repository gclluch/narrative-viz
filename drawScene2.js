// Scene 2: Happiness by GDP
function drawScene2(data, year) {
    d3.select("#scene2").selectAll("svg").remove();

    const svg = d3.select("#scene2").append("svg")
        .attr("width", 1200)
        .attr("height", 800);

    const margin = { top: 20, right: 30, bottom: 50, left: 70 }, // Adjusted bottom and left margins for labels
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    // Filter data by year and remove entries with blank or 0 GDP
    const filteredData = data.filter(d => d.year == year && d['Log GDP per capita'] && +d['Log GDP per capita'] > 0);

    const x = d3.scaleLinear()
        .domain(d3.extent(filteredData, d => +d['Log GDP per capita']))
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain(d3.extent(filteredData, d => +d['Life Ladder']))
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    svg.selectAll(".dot")
        .data(filteredData)
        .join("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d['Log GDP per capita']))
        .attr("cy", d => y(d['Life Ladder']))
        .attr("r", 5)
        .attr("fill", d => color(d['Country name']));

    // Tooltip setup
    const tooltip = d3.select("#tooltip");

    svg.selectAll(".dot")
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Country: ${d['Country name']}<br>Log GDP: ${d['Log GDP per capita']}<br>Life Ladder: ${d['Life Ladder']}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Add X axis label
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 30)
        .text("Log GDP per Capita");

    // Add Y axis label
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "middle")
        .attr("x", -height / 2)
        .attr("y", margin.left - 60)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Life Ladder");
}
