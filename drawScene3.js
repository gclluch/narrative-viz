// Scene 3: Happiness Factors Breakdown
function drawScene3(data, selectedOptions = []) {
    d3.select("#scene3").selectAll("svg").remove();
    d3.select("#scene3-controls .legend").remove();

    const svg = d3.select("#scene3").append("svg")
        .attr("width", 1200)
        .attr("height", 800);

    const margin = { top: 20, right: 30, bottom: 70, left: 100 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    const keys = ["Explained by: Log GDP per capita", "Explained by: Social support", "Explained by: Healthy life expectancy", "Explained by: Freedom to make life choices", "Explained by: Generosity", "Explained by: Perceptions of corruption", "Dystopia + residual"];

    const renamedKeys = {
        "Explained by: Log GDP per capita": "Log GDP per capita",
        "Explained by: Social support": "Social support",
        "Explained by: Healthy life expectancy": "Healthy life expectancy",
        "Explained by: Freedom to make life choices": "Freedom to make life choices",
        "Explained by: Generosity": "Generosity",
        "Explained by: Perceptions of corruption": "Perceptions of corruption",
        "Dystopia + residual": "Residual"
    };

    // Filter out specific countries and countries with null or none values
    const filteredData = data.filter(d => {
        return !["Bahrain", "State of Palestine", "Tajikistan"].includes(d['Country name']) &&
            keys.every(key => d[key] !== null && d[key] !== "none");
    });

    const groupedData = d3.group(filteredData, d => d['Country name']);

    const x = d3.scaleBand()
        .domain(Array.from(groupedData.keys()))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d['Ladder score'])])
        .nice()
        .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.schemeCategory10);

    const xAxis = svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSize(0));

    if (selectedOptions.includes("all") || selectedOptions.length === 0) {
        xAxis.selectAll("text").remove();
    } else {
        xAxis.selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")
            .style("display", (d, i) => i % Math.ceil(groupedData.size / 10) === 0 ? "block" : "none"); // Show only some labels
    }

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    const stack = d3.stack()
        .keys(keys)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    const stackedData = stack(filteredData.map(d => {
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
        .attr("y", height + margin.bottom - 50)
        .text("Country");

    // Add Y axis label
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "middle")
        .attr("x", -height / 2)
        .attr("y", margin.left - 100)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Happiness Score Breakdown");

    // Tooltip setup
    const tooltip = d3.select("#tooltip");

    svg.selectAll("rect")
        .on("mouseover", function(event, d) {
            const key = d3.select(this.parentNode).datum().key;
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Country: ${d.data['Country name']}<br>${renamedKeys[key]}<br>Value: ${d[1] - d[0]}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Legend setup
    const legend = d3.select("#scene3-controls").append("div")
        .attr("class", "legend");

    legend.selectAll("div.legend-item")
        .data(keys)
        .enter()
        .append("div")
        .attr("class", "legend-item")
        .style("display", "flex")
        .style("align-items", "center")
        .style("margin-bottom", "5px")
        .each(function(d) {
            const legendItem = d3.select(this);

            legendItem.append("div")
                .style("width", "20px")
                .style("height", "20px")
                .style("background-color", color(d))
                .style("margin-right", "5px");

            legendItem.append("span")
                .text(renamedKeys[d]);
        });
}
