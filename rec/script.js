const trips = JSON.parse(
    localStorage.getItem("wanderlyTrips")
);

const container = document.getElementById("cards-container");

console.log("Trips Loaded:", trips);

async function getImage(imageQuery) {

    try {

        console.log("Fetching image for:", imageQuery);

        const response = await fetch(
            `http://localhost:3000/image?q=${encodeURIComponent(imageQuery)}`
        );

        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`);
        }

        const data = await response.json();

        console.log("Image API Response:", data);

        if (data.image) {
            return data.image;
        }

        return "https://images.pexels.com/photos/672358/pexels-photo-672358.jpeg";

    } catch (err) {

        console.error("Image Fetch Error:", err);

        return "https://images.pexels.com/photos/672358/pexels-photo-672358.jpeg";
    }
}

async function renderTrips() {

    if (!trips || trips.length === 0) {

        container.innerHTML = `
            <div class="alert alert-warning mt-4">
                No recommendations found.
            </div>
        `;

        return;
    }

    container.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-success"></div>
            <p class="mt-3">Loading recommendations...</p>
        </div>
    `;

    let cardsHTML = "";

    for (let index = 0; index < trips.length; index++) {

        const trip = trips[index];

        const imageUrl = await getImage(
            trip.imageQuery || trip.destination
        );

        console.log("Final Image URL:", imageUrl);

        const tags = (trip.activities || [])
            .map(activity => `<span>${activity}</span>`)
            .join("");

        cardsHTML += `
        <div class="destination-card">

            <div class="rank-badge">
                ${index + 1}
            </div>

            <img
                src="${imageUrl}"
                alt="${trip.destination}"
                loading="lazy"
                onerror="this.src='https://images.pexels.com/photos/672358/pexels-photo-672358.jpeg'"
            >

            <div class="destination-info">

                <div class="card-header">

                    <h3>${trip.destination}</h3>

                    <i class="fa-regular fa-heart heart"></i>

                </div>

                <div class="tags">
                    ${tags}
                </div>

                <p>
                    ${trip.descriptionLong}
                </p>

                <div class="bottom-info">

                    <div>
                        <h6>${trip.duration}</h6>
                        <small>Duration</small>
                    </div>

                    <div class="divider"></div>

                    <div>
                        <h6>₹${Number(trip.cost).toLocaleString("en-IN")}</h6>
                        <small>Est. Cost</small>
                    </div>

                    <div class="divider"></div>

                    <div>
                        <h6>${trip.bestSeason}</h6>
                        <small>Best Season</small>
                    </div>

                    <button
                        class="view-btn"
                        data-index="${index}"
                    >
                        View Details
                    </button>

                </div>

            </div>

        </div>
        `;
    }

    container.innerHTML = cardsHTML;

    document.querySelectorAll(".view-btn")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                const trip = trips[
                    parseInt(btn.dataset.index)
                ];

                viewTrip(trip);

            });

        });
}

function viewTrip(trip) {

    localStorage.setItem(
        "selectedTrip",
        JSON.stringify(trip)
    );

    console.log("Selected Trip:", trip);

    // Future:
    // window.location.href = "./details.html";
}

renderTrips();