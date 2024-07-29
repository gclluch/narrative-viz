// Main JavaScript file
Promise.all([
    d3.csv("happiness_by_year.csv"),
    d3.csv("happiness_summary.csv")
]).then(data => {
    const happinessByYear = data[0];
    const happinessSummary = data[1];
    drawScene1(happinessByYear);

    // Initialize Select2 on dropdowns
    $('#country-filter').select2();
    $('#country-filter-scene2').select2();
    $('#country-filter-scene3').select2();

    // Function to update active scene button
    function setActiveSceneButton(activeButtonId) {
        document.querySelectorAll('.navigation-button').forEach(button => {
            button.classList.remove('active');
        });
        document.getElementById(activeButtonId).classList.add('active');
    }

    // Set initial active scene button
    setActiveSceneButton("scene1-btn");

    // Event listeners for navigation buttons
    document.getElementById("scene1-btn").addEventListener("click", () => {
        d3.selectAll(".scene").classed("visible", false);
        d3.select("#scene1").classed("visible", true);
        d3.select("#scene1-controls").classed("visible", true);
        setActiveSceneButton("scene1-btn");
        drawScene1(happinessByYear);
    });

    document.getElementById("scene2-btn").addEventListener("click", () => {
        d3.selectAll(".scene").classed("visible", false);
        d3.select("#scene2").classed("visible", true);
        d3.select("#scene2-controls").classed("visible", true);
        setActiveSceneButton("scene2-btn");
        const year = document.getElementById("year-filter").value;
        drawScene2(happinessByYear, year);
    });

    document.getElementById("scene3-btn").addEventListener("click", () => {
        d3.selectAll(".scene").classed("visible", false);
        d3.select("#scene3").classed("visible", true);
        d3.select("#scene3-controls").classed("visible", true);
        setActiveSceneButton("scene3-btn");
        drawScene3(happinessSummary, []);
    });

    // Populate country dropdown for Scene 1
    const countries = Array.from(new Set(happinessByYear.map(d => d['Country name'])));
    const dropdown = d3.select("#country-filter");
    countries.forEach(country => {
        dropdown.append("option").text(country).attr("value", country);
    });

    // Event listener for Scene 1 country dropdown
    $('#country-filter').on("change", function() {
        const selectedOptions = $(this).val();
        let filteredData = happinessByYear;
        const selectedCountries = new Set();

        if (selectedOptions.includes("all")) {
            filteredData = happinessByYear;
        } else {
            if (selectedOptions.includes("major")) {
                const majorCountries = ["Germany", "Brazil", "United States", "China", "South Africa"];
                majorCountries.forEach(country => selectedCountries.add(country));
            }
            if (selectedOptions.includes("happiest")) {
                const happiestCountries = ["Finland", "Denmark", "Iceland", "Sweden", "Israel"];
                happiestCountries.forEach(country => selectedCountries.add(country));
            }
            if (selectedOptions.includes("least")) {
                const leastHappyCountries = ["Congo (Kinshasa)", "Sierra Leone", "Lesotho", "Lebanon", "Afghanistan"];
                leastHappyCountries.forEach(country => selectedCountries.add(country));
            }
            selectedOptions.forEach(option => {
                if (!["all", "major", "happiest", "least"].includes(option)) {
                    selectedCountries.add(option);
                }
            });

            filteredData = filteredData.filter(d => selectedCountries.has(d['Country name']));
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
        const selectedOptions = $('#country-filter-scene2').val();
        let filteredData = happinessByYear.filter(d => d.year == year);
        const selectedCountries = new Set();

        if (selectedOptions.includes("all")) {
            filteredData = happinessByYear.filter(d => d.year == year);
        } else {
            if (selectedOptions.includes("major")) {
                const majorCountries = ["Germany", "Brazil", "United States", "China", "South Africa"];
                majorCountries.forEach(country => selectedCountries.add(country));
            }
            if (selectedOptions.includes("happiest")) {
                const happiestCountries = ["Finland", "Denmark", "Iceland", "Sweden", "Israel"];
                happiestCountries.forEach(country => selectedCountries.add(country));
            }
            if (selectedOptions.includes("least")) {
                const leastHappyCountries = ["Congo (Kinshasa)", "Sierra Leone", "Lesotho", "Lebanon", "Afghanistan"];
                leastHappyCountries.forEach(country => selectedCountries.add(country));
            }
            selectedOptions.forEach(option => {
                if (!["all", "major", "happiest", "least"].includes(option)) {
                    selectedCountries.add(option);
                }
            });

            filteredData = filteredData.filter(d => selectedCountries.has(d['Country name']));
        }

        drawScene2(filteredData, year);
    });

    // Event listener for Scene 2 country dropdown
    $('#country-filter-scene2').on("change", function() {
        const selectedOptions = $(this).val();
        const year = document.getElementById("year-filter").value;
        let filteredData = happinessByYear.filter(d => d.year == year);
        const selectedCountries = new Set();

        if (selectedOptions.includes("all")) {
            filteredData = happinessByYear.filter(d => d.year == year);
        } else {
            if (selectedOptions.includes("major")) {
                const majorCountries = ["Germany", "Brazil", "United States", "China", "South Africa"];
                majorCountries.forEach(country => selectedCountries.add(country));
            }
            if (selectedOptions.includes("happiest")) {
                const happiestCountries = ["Finland", "Denmark", "Iceland", "Sweden", "Israel"];
                happiestCountries.forEach(country => selectedCountries.add(country));
            }
            if (selectedOptions.includes("least")) {
                const leastHappyCountries = ["Congo (Kinshasa)", "Sierra Leone", "Lesotho", "Lebanon", "Afghanistan"];
                leastHappyCountries.forEach(country => selectedCountries.add(country));
            }
            selectedOptions.forEach(option => {
                if (!["all", "major", "happiest", "least"].includes(option)) {
                    selectedCountries.add(option);
                }
            });

            filteredData = filteredData.filter(d => selectedCountries.has(d['Country name']));
        }

        drawScene2(filteredData, year);
    });

    // Populate country dropdown for Scene 3
    const countryDropdownScene3 = d3.select("#country-filter-scene3");
    countries.forEach(country => {
        countryDropdownScene3.append("option").text(country).attr("value", country);
    });

    // Event listener for Scene 3 country dropdown
    $('#country-filter-scene3').on("change", function() {
        const selectedOptions = $(this).val();
        let filteredData = happinessSummary;
        const selectedCountries = new Set();

        if (selectedOptions.includes("all")) {
            filteredData = happinessSummary;
        } else {
            if (selectedOptions.includes("major")) {
                const majorCountries = ["Germany", "Brazil", "United States", "China", "South Africa"];
                majorCountries.forEach(country => selectedCountries.add(country));
            }
            if (selectedOptions.includes("happiest")) {
                const happiestCountries = ["Finland", "Denmark", "Iceland", "Sweden", "Israel"];
                happiestCountries.forEach(country => selectedCountries.add(country));
            }
            if (selectedOptions.includes("least")) {
                const leastHappyCountries = ["Congo (Kinshasa)", "Sierra Leone", "Lesotho", "Lebanon", "Afghanistan"];
                leastHappyCountries.forEach(country => selectedCountries.add(country));
            }
            selectedOptions.forEach(option => {
                if (!["all", "major", "happiest", "least"].includes(option)) {
                    selectedCountries.add(option);
                }
            });

            filteredData = filteredData.filter(d => selectedCountries.has(d['Country name']));
        }

        drawScene3(filteredData, selectedOptions);
    });
});
