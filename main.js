// Main JavaScript file
Promise.all([
    d3.csv("happiness_by_year.csv"),
    d3.csv("happiness_summary.csv")
]).then(data => {
    const happinessByYear = data[0];
    const happinessSummary = data[1];
    drawScene1(happinessByYear);

    // Event listeners for navigation buttons
    document.getElementById("scene1-btn").addEventListener("click", () => {
        d3.selectAll(".scene").classed("visible", false);
        d3.select("#scene1").classed("visible", true);
        drawScene1(happinessByYear);
    });

    document.getElementById("scene2-btn").addEventListener("click", () => {
        d3.selectAll(".scene").classed("visible", false);
        d3.select("#scene2").classed("visible", true);
        const year = document.getElementById("year-filter").value;
        drawScene2(happinessByYear, year);
    });

    document.getElementById("scene3-btn").addEventListener("click", () => {
        d3.selectAll(".scene").classed("visible", false);
        d3.select("#scene3").classed("visible", true);
        drawScene3(happinessSummary);
    });

    // Populate country dropdown for Scene 1
    const countries = Array.from(new Set(happinessByYear.map(d => d['Country name'])));
    const dropdown = d3.select("#country-filter");
    countries.forEach(country => {
        dropdown.append("option").text(country).attr("value", country);
    });

    // Event listener for Scene 1 country dropdown
    dropdown.on("change", function() {
        const selectedOption = this.value;
        let filteredData;

        if (selectedOption === "all") {
            filteredData = happinessByYear;
        } else if (selectedOption === "major") {
            const majorCountries = ["Germany", "Brazil", "United States", "China", "South Africa"];
            filteredData = happinessByYear.filter(d => majorCountries.includes(d['Country name']));
        } else if (selectedOption === "happiest") {
            const happiestCountries = ["Finland", "Denmark", "Iceland", "Sweden", "Israel"];
            filteredData = happinessByYear.filter(d => happiestCountries.includes(d['Country name']));
        } else if (selectedOption === "least") {
            const leastHappyCountries = ["Congo (Kinshasa)", "Sierra Leone", "Lesotho", "Lebanon", "Afghanistan"];
            filteredData = happinessByYear.filter(d => leastHappyCountries.includes(d['Country name']));
        } else {
            filteredData = happinessByYear.filter(d => d['Country name'] === selectedOption);
        }

        drawScene1(filteredData);
    });

    // Populate year dropdown for Scene 2
    const years = Array.from(new Set(happinessByYear.map(d => d.year))).sort((a, b) => b - a);
    const yearDropdown = d3.select("#year-filter");
    years.forEach(year => {
        yearDropdown.append("option").text(year).attr("value", year);
    });
    yearDropdown.property("value", "2023"); // Set default value to 2023

    // Populate country dropdown for Scene 2
    const countryDropdownScene2 = d3.select("#country-filter-scene2");
    countries.forEach(country => {
        countryDropdownScene2.append("option").text(country).attr("value", country);
    });

    // Event listener for Scene 2 year dropdown
    yearDropdown.on("change", function() {
        const year = this.value;
        const selectedOption = document.getElementById("country-filter-scene2").value;
        let filteredData;

        if (selectedOption === "all") {
            filteredData = happinessByYear;
        } else if (selectedOption === "major") {
            const majorCountries = ["Germany", "Brazil", "United States", "China", "South Africa"];
            filteredData = happinessByYear.filter(d => majorCountries.includes(d['Country name']));
        } else if (selectedOption === "happiest") {
            const happiestCountries = ["Finland", "Denmark", "Iceland", "Sweden", "Israel"];
            filteredData = happinessByYear.filter(d => happiestCountries.includes(d['Country name']));
        } else if (selectedOption === "least") {
            const leastHappyCountries = ["Congo (Kinshasa)", "Sierra Leone", "Lesotho", "Lebanon", "Afghanistan"];
            filteredData = happinessByYear.filter(d => leastHappyCountries.includes(d['Country name']));
        } else {
            filteredData = happinessByYear.filter(d => d['Country name'] === selectedOption);
        }

        drawScene2(filteredData, year);
    });

    // Event listener for Scene 2 country dropdown
    countryDropdownScene2.on("change", function() {
        const selectedOption = this.value;
        const year = document.getElementById("year-filter").value;
        let filteredData;

        if (selectedOption === "all") {
            filteredData = happinessByYear;
        } else if (selectedOption === "major") {
            const majorCountries = ["Germany", "Brazil", "United States", "China", "South Africa"];
            filteredData = happinessByYear.filter(d => majorCountries.includes(d['Country name']));
        } else if (selectedOption === "happiest") {
            const happiestCountries = ["Finland", "Denmark", "Iceland", "Sweden", "Israel"];
            filteredData = happinessByYear.filter(d => happiestCountries.includes(d['Country name']));
        } else if (selectedOption === "least") {
            const leastHappyCountries = ["Congo (Kinshasa)", "Sierra Leone", "Lesotho", "Lebanon", "Afghanistan"];
            filteredData = happinessByYear.filter(d => leastHappyCountries.includes(d['Country name']));
        } else {
            filteredData = happinessByYear.filter(d => d['Country name'] === selectedOption);
        }

        drawScene2(filteredData, year);
    });
});
