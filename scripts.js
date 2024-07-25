// Load data
Promise.all([
    d3.csv("happiness_by_year.csv"),
    d3.csv("happiness_summary.csv")
]).then(data => {
    const happinessByYear = data[0];
    const happinessSummary = data[1];
    drawScene1(happinessByYear);
    drawScene2(happinessByYear);
    drawScene3(happinessSummary);
});

// Draw Scene 1: Global Happiness Trends
function drawScene1(data) {
    const svg = d3.select("#scene1").append("svg");
    const margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    const x = d3.scaleLinear().domain(d3.extent(data, d => +d.year)).range([margin.left, width - margin.right]);
    const y = d3.scaleLinear().domain(d3.extent(data, d => +d['Life Ladder'])).range([height - margin.bottom, margin.top]);

    const line = d3.line()
        .x(d => x(+d.year))
        .y(d => y(+d['Life Ladder']));

    const countries = [...new Set(data.map(d => d['Country name']))];
    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(countries);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    svg.append("g")
        .selectAll("path")
        .data(countries.map(country => data.filter(d => d['Country name'] === country)))
        .join("path")
        .attr("fill", "none")
        .attr("stroke", d => color(d[0]['Country name']))
        .attr("d", d => line(d));

    // Add Annotations
    svg.append("text")
        .attr("x", x(2019))
        .attr("y", y(7.6))
        .attr("class", "annotation")
        .text("Finland remains the happiest country");

    svg.append("text")
        .attr("x", x(2020))
        .attr("y", y(5.0))
        .attr("class", "annotation")
        .text("Global dip in happiness due to COVID-19");
}

// Draw Scene 2: Happiness Factors Breakdown
function drawScene2(data) {
    const svg = d3.select("#scene2").append("svg");
    const margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    const selectedYear = 2020;
    const filteredData = data.filter(d => +d.year === selectedYear);

    const x = d3.scaleBand()
        .domain(filteredData.map(d => d['Country name']))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => +d['Life Ladder'])])
        .nice()
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    svg.selectAll(".bar")
        .data(filteredData)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => x(d['Country name']))
        .attr("y", d => y(d['Life Ladder']))
        .attr("height", d => y(0) - y(d['Life Ladder']))
        .attr("width", x.bandwidth())
        .attr("fill", "steelblue");

    // Add Annotations
    svg.append("text")
        .attr("x", x('Finland'))
        .attr("y", y(7.6))
        .attr("class", "annotation")
        .text("Finland is the happiest country");

    svg.append("text")
        .attr("x", x('Afghanistan'))
        .attr("y", y(1.5))
        .attr("class", "annotation")
        .text("Afghanistan is the least happy country");
}

// Draw Scene 3: Country Comparison
function drawScene3(data) {
    const svg = d3.select("#scene3").append("svg");
    const margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    const x = d3.scaleLinear().domain([0, d3.max(data, d => +d['Explained by: Log GDP per capita'])]).range([margin.left, width - margin.right]);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => +d['Ladder score'])]).range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    svg.selectAll(".dot")
        .data(data)
        .join("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d['Explained by: Log GDP per capita']))
        .attr("cy", d => y(d['Ladder score']))
        .attr("r", 5)
        .attr("fill", "steelblue");

    // Add Annotations
    svg.append("text")
        .attr("x", x(1.8))
        .attr("y", y(7.7))
        .attr("class", "annotation")
        .text("High GDP correlates with higher happiness");

    svg.append("text")
        .attr("x", x(0.3))
        .attr("y", y(2.0))
        .attr("class", "annotation")
        .text("Low GDP correlates with lower happiness");
}

// Navigation
document.getElementById("scene1-btn").addEventListener("click", () => {
    d3.selectAll(".scene").classed("visible", false);
    d3.select("#scene1").classed("visible", true);
});

document.getElementById("scene2-btn").addEventListener("click", () => {
    d3.selectAll(".scene").classed("visible", false);
    d3.select("#scene2").classed("visible", true);
});

document.getElementById("scene3-btn").addEventListener("click", () => {
    d3.selectAll(".scene").classed("visible", false);
    d3.select("#scene3").classed("visible", true);
});

// Initialize first scene as visible
d3.select("#scene1").classed("visible", true);
