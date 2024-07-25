function drawScene1(data) {
    d3.select("#scene1").selectAll("*").remove();
    const svg = d3.select("#scene1").append("svg")
        .attr("width", 1200)
        .attr("height", 800);

    const margin = { top: 20, right: 30, bottom: 50, left: 50 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    const x = d3.scaleLinear().domain(d3.extent(data, d => +d.year)).range([0, width]);
    const y = d3.scaleLinear().domain([0, 8]).range([height, 0]);

    const line = d3.line()
        .x(d => x(+d.year))
        .y(d => y(+d['Life Ladder']));

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    svg.append("g")
        .attr("transform", `translate(${margin.left},${height + margin.top})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .call(d3.axisLeft(y));

    const countries = ["Finland", "United States", "Mexico", "China", "South Africa"];
    countries.forEach(country => {
        const countryData = data.filter(d => d['Country name'] === country);
        svg.append("path")
            .datum(countryData)
            .attr("fill", "none")
            .attr("stroke", color(country))
            .attr("d", line)
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .attr("stroke-width", 2);

        let xOffset = 3, yOffset = 0;
        if (country === "United States") {
            xOffset = 5;
            yOffset = -10;
        } else if (country === "Mexico") {
            xOffset = 5;
            yOffset = 10;
        }

        svg.append("text")
            .datum(countryData[countryData.length - 1])
            .attr("transform", d => `translate(${x(d.year) + margin.left},${y(d['Life Ladder']) + margin.top})`)
            .attr("x", xOffset)
            .attr("dy", "0.35em")
            .style("font", "10px sans-serif")
            .attr("class", "country-label")
            .text(country);
    });

    const tooltip = d3.select("#tooltip");

    svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => x(d.year) + margin.left)
        .attr("cy", d => y(d['Life Ladder']) + margin.top)
        .attr("r", 5)
        .attr("fill", "transparent")
        .attr("stroke", "none")
        .on("mouseover", function(event, d) {
            tooltip.style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px")
                .style("opacity", .9);
            tooltip.select("#value").text(`Country: ${d['Country name']} Year: ${d.year} Life Ladder: ${d['Life Ladder']}`);
        })
        .on("mouseout", function(d) {
            tooltip.style("opacity", 0);
        });
}
