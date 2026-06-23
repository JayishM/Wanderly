let budget = document.getElementById("budget");
let duration = document.getElementById("duration");
let travel = document.querySelector("#travel");
let btn = document.getElementById("btn");

btn.addEventListener("click", async () => {

    try {

        let response = await fetch(
            `http://localhost:3000/rec?budget=${budget.value}&duration=${duration.value}&travel=${travel.value}`
        );

        let result = await response.json();

        console.log(result);

        localStorage.setItem(
            "wanderlyTrips",
            JSON.stringify(result.trips)
        );

        window.location.href = "./rec/index.html";

    } catch (err) {

        console.error(err);

    }

});