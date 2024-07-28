// Scene 3: Happiness Factors Breakdown
function drawScene3(data) {
    d3.select("#scene3").selectAll("svg").remove();

    const svg = d3.select("#scene3").append("svg")
        .attr("width", 1200)
        .attr("height", 800);

    const margin = { top: 20, right: 30, bottom: 70, left: 100 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    const groupedData = d3.group(data, d => d['Country name']);
    const keys = ["Explained by: Log GDP per capita", "Explained by: Social support", "Explained by: Healthy life expectancy", "Explained by: Freedom to make life choices", "Explained by: Generosity", "Explained by: Perceptions of corruption", "Dystopia + residual"];

    const x = d3.scaleBand()
        .domain(Array.from(groupedData.keys()))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d['Ladder score'])])
        .nice()
        .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.schemeCategory10);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    const stack = d3.stack()
        .keys(keys)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    const stackedData = stack(data.map(d => {
        const countryData = {};
        keys.forEach(key => countryData[key] = d[key]);
        countryData['Country name'] = d['Country name'];
        return countryData;
    }));

    svg.selectAll("g.layer")
        .data(stackedData)
        .join("g")
        .attr("class", "layer")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", d => x(d.data['Country name']))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth());

    // Add X axis label
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .text("Country");

    // Add Y axis label
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "middle")
        .attr("x", -height / 2)
        .attr("y", margin.left - 60)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Happiness Score Breakdown");

    // Tooltip setup
    const tooltip = d3.select("#tooltip");

    svg.selectAll("rect")
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Country: ${d.data['Country name']}<br>Value: ${d[1] - d[0]}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}
