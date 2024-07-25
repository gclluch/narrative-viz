function drawScene2(data) {
    d3.select("#scene2").selectAll("*").remove();
    const svg = d3.select("#scene2").append("svg")
        .attr("width", 1200)
        .attr("height", 800);

    const margin = { top: 20, right: 30, bottom: 50, left: 70 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    const x = d3.scaleLinear()
        .domain([1.2, 2.0])  // Adjusted to start at 1.2
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([4.5, 8])  // Adjusted to start at 4.5
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .append("text")
        .attr("y", 35)
        .attr("x", width / 2)
        .attr("fill", "black")
        .text("GDP per capita");

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -height / 2)
        .attr("fill", "black")
        .text("Happiness Score");

    const countries = ["Finland", "United States", "Mexico", "China", "South Africa"];
    const filteredData = data.filter(d => countries.includes(d['Country name']));

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    svg.selectAll(".dot")
        .data(filteredData)
        .join("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d['Explained by: Log GDP per capita']))
        .attr("cy", d => y(d['Ladder score']))
        .attr("r", 5)
        .attr("fill", d => color(d['Country name']))
        .on("mouseover", function(event, d) {
            d3.select(this).attr("fill", "orange");
            d3.select("#tooltip")
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px")
                .select("#value")
                .text(`Country: ${d['Country name']}, GDP: ${d['Explained by: Log GDP per capita']}, Happiness: ${d['Ladder score']}`);
            d3.select("#tooltip").classed("hidden", false);
        })
        .on("mouseout", function(event, d) {
            d3.select(this).attr("fill", color(d['Country name']));
            d3.select("#tooltip").classed("hidden", true);
        });

    // Add labels for the dots
    svg.selectAll(".label")
        .data(filteredData)
        .join("text")
        .attr("class", "label")
        .attr("x", d => x(d['Explained by: Log GDP per capita']) + 7)
        .attr("y", d => y(d['Ladder score']) + 3)
        .text(d => d['Country name']);

    // Add Annotations
    svg.append("text")
        .attr("x", x(1.8))
        .attr("y", y(7.0))
        .attr("class", "annotation")
        .attr("fill", "green")
        .text("High GDP correlates with higher happiness");

    svg.append("text")
        .attr("x", x(1.3))
        .attr("y", y(5.0))
        .attr("class", "annotation")
        .attr("fill", "green")
        .text("Low GDP correlates with lower happiness");
}
