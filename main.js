// Load data
Promise.all([
    d3.csv("happiness_by_year.csv"),
    d3.csv("happiness_summary.csv")
]).then(data => {
    const happinessByYear = data[0];
    const happinessSummary = data[1];
    drawScene1(happinessByYear);
    drawScene2(happinessSummary);
    drawScene3(happinessSummary);
});

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
