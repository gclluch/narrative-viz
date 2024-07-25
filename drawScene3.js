function drawScene3(data) {
    d3.select("#scene3").selectAll("*").remove();

    const svg = d3.select("#scene3").append("svg")
        .attr("width", 1800)
        .attr("height", 900);  // Adjust height to make room for the legend

    const margin = { top: 20, right: 30, bottom: 100, left: 70 },  // Adjust bottom margin
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    const factors = ["Explained by: Log GDP per capita", "Explained by: Social support", "Explained by: Healthy life expectancy", "Explained by: Freedom to make life choices", "Explained by: Generosity", "Explained by: Perceptions of corruption"];
    const countries = ["Finland", "United States", "Mexico", "China", "South Africa"];
    const filteredData = data.filter(d => countries.includes(d['Country name']));

    const factorWidth = width / factors.length;

    const color = d3.scaleOrdinal()
        .domain(countries)
        .range(d3.schemeCategory10);

    factors.forEach((factor, i) => {
        const factorData = filteredData.map(d => ({
            country: d['Country name'],
            value: +d[factor]
        }));

        const x = d3.scaleBand()
            .domain(countries)
            .range([i * factorWidth + margin.left, (i + 1) * factorWidth - margin.right])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(factorData, d => d.value)]).nice()
            .range([height - margin.bottom, margin.top]);

        const chart = svg.append("g");

        chart.selectAll(".bar")
            .data(factorData)
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.country))
            .attr("y", d => y(d.value))
            .attr("height", d => y(0) - y(d.value))
            .attr("width", x.bandwidth())
            .attr("fill", d => color(d.country));

        chart.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickFormat(""))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        chart.append("g")
            .attr("transform", `translate(${i * factorWidth + margin.left},0)`)
            .call(d3.axisLeft(y));

        chart.append("text")
            .attr("x", (i * factorWidth + (factorWidth / 2)))
            .attr("y", height - margin.bottom + 40)
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .text(factor.replace("Explained by: ", ""));
    });

    const legend = svg.append("g")
        .attr("transform", `translate(${width / 2 - 775}, ${height + margin.bottom / 2  - 70})`);  // Adjust position of the legend

    countries.forEach((country, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);

        legendRow.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", color(country));

        legendRow.append("text")
            .attr("x", 20)
            .attr("y", 10)
            .attr("text-anchor", "start")
            .text(country);
    });
}

document.getElementById("scene3-btn").addEventListener("click", () => {
    d3.selectAll(".scene").classed("visible", false);
    d3.select("#scene3").classed("visible", true);
});
