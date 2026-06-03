const BLACK_CLOVER_ID = 34572;
const API_URL = "https://api.jikan.moe/v4";
const LOCAL_IMAGE = "../imgs/newblackclover.webp";

const factImage = document.querySelector("#factImage");
const factTitle = document.querySelector("#factTitle");
const factBody = document.querySelector("#factBody");
const factFooter = document.querySelector("#factFooter");
const dots = [...document.querySelectorAll(".dot")];
const previous = document.querySelector(".arrow-left");
const next = document.querySelector(".arrow-right");
const menuTriggers = [...document.querySelectorAll(".menu-trigger")];
const sideMenu = document.querySelector(".side-menu");
const menuBackdrop = document.querySelector(".menu-backdrop");
const loginPanel = document.querySelector(".login-panel");
const registerPanel = document.querySelector(".register-panel");
const dashboardTabs = [...document.querySelectorAll("[data-dashboard-tab]")];
const dashboardListTitle = document.querySelector("#dashboardListTitle");
const dashboardList = document.querySelector("#dashboardList");
const dashboardInfoImage = document.querySelector("#dashboardInfoImage");
const dashboardInfoText = document.querySelector("#dashboardInfoText");
const dashboardView = document.querySelector(".dashboard-view");

let blackCloverFacts = [];
let currentFact = 0;
let dashboardMode = "houses";
let dashboardItems = {
    houses: [],
    characters: []
};

const housesData = [
    {
        name: "BLACK BULLS",
        text: "Los Toros Negros son un escuadron de Caballeros Magicos conocido por reunir magos inusuales, poderosos y muy leales.",
        image: "https://static.wikia.nocookie.net/blackclover/images/b/b2/Black_Bull_Insignia.png/revision/latest?cb=20170919183456"
    },
    {
        name: "GOLDEN DAWN",
        text: "Amanecer Dorado es reconocido como uno de los escuadrones mas prestigiosos del Reino del Trebol.",
        image: "https://static.wikia.nocookie.net/blackclover/images/7/7b/Golden_Dawn_Insignia.png/revision/latest?cb=20170919183115"
    },
    {
        name: "CRIMSON LIONS",
        text: "Los Leones Carmesi destacan por su fuerza, disciplina y orgullo dentro de la orden de Caballeros Magicos.",
        image: "https://static.wikia.nocookie.net/blackclover/images/7/78/Crimson_Lion_Insignia.png/revision/latest?cb=20170919182732"
    },
    {
        name: "SILVER EAGLES",
        text: "Las Aguilas Plateadas son un escuadron asociado con familias nobles y magia de alto nivel.",
        image: "https://static.wikia.nocookie.net/blackclover/images/8/86/Silver_Eagle_Insignia.png/revision/latest?cb=20170919180808"
    },
    {
        name: "BLUE ROSE",
        text: "Rosa Azul es un escuadron liderado por Charlotte Roselei y conocido por su magia de briar.",
        image: "https://static.wikia.nocookie.net/blackclover/images/9/9b/Blue_Rose_Insignia.png/revision/latest?cb=20170919181802"
    },
    {
        name: "GREEN MANTIS",
        text: "Mantis Verde es uno de los escuadrones oficiales del Reino del Trebol dentro de los Caballeros Magicos.",
        image: "https://static.wikia.nocookie.net/blackclover/images/e/e2/Green_Mantis_Insignia.png/revision/latest?cb=20170919182414"
    },
    {
        name: "CORAL PEACOCKS",
        text: "Pavos Reales Coral es un escuadron de Caballeros Magicos con miembros de habilidades muy particulares.",
        image: "https://static.wikia.nocookie.net/blackclover/images/c/c2/Coral_Peacock_Insignia.png/revision/latest?cb=20171024190956"
    },
    {
        name: "PURPLE ORCAS",
        text: "Orcas Moradas es otro de los escuadrones oficiales del Reino del Trebol.",
        image: "https://static.wikia.nocookie.net/blackclover/images/2/20/Purple_Orca_Insignia.png/revision/latest?cb=20171024190458"
    },
    {
        name: "AQUA DEER",
        text: "Ciervos Aqua es un escuadron asociado con magos creativos y capitanes destacados como Rill Boismortier.",
        image: "https://static.wikia.nocookie.net/blackclover/images/8/86/Aqua_Deer_Insignia.png/revision/latest?cb=20171024185938"
    }
];

function renderFact(index) {
    const fact = blackCloverFacts[index];

    if (!fact || !factImage) {
        return;
    }

    factImage.src = fact.detail;
    factTitle.textContent = fact.title;
    factBody.textContent = fact.body;
    factFooter.textContent = fact.footer;

    dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === index);
    });
}

function setMenuOpen(isOpen) {
    if (!sideMenu || !menuBackdrop) {
        return;
    }

    sideMenu.classList.toggle("is-open", isOpen);
    menuBackdrop.classList.toggle("is-open", isOpen);
    menuTriggers.forEach((trigger) => {
        trigger.setAttribute("aria-expanded", isOpen);
    });
    sideMenu.setAttribute("aria-hidden", !isOpen);
}

function pickRandom(items, limit = 3) {
    return [...items].sort(() => Math.random() - 0.5).slice(0, limit);
}

function buildAnimeFacts(anime, pictures, characters) {
    const poster = anime.images?.jpg?.large_image_url || LOCAL_IMAGE;
    const webImages = pictures
        .map((picture) => picture.jpg?.large_image_url)
        .filter(Boolean);

    const facts = [
        {
            detail: poster,
            title: "Sabias que:",
            body: anime.title || "Black Clover",
            footer: `tiene ${anime.episodes || "varios"} episodios registrados`
        },
        {
            detail: webImages[2] || poster,
            title: "Sabias que:",
            body: anime.source ? `viene de un ${anime.source}` : "viene del manga",
            footer: anime.status || "es una historia muy popular"
        },
        {
            detail: webImages[4] || poster,
            title: "Sabias que:",
            body: anime.score ? `su score es ${anime.score}` : "esta en MyAnimeList",
            footer: anime.rank ? `y su ranking es #${anime.rank}` : "con muchos fans"
        }
    ];

    pickRandom(characters, 3).forEach(({ character, role }) => {
        facts.push({
            detail: character.images?.jpg?.image_url || poster,
            title: "Sabias que:",
            body: character.name,
            footer: `aparece como ${role?.toLowerCase() || "personaje"}`
        });
    });

    return pickRandom(facts, 3);
}

function renderDashboardItem(index = 0) {
    const items = dashboardItems[dashboardMode];
    const selected = items[index] || items[0];

    if (!selected || !dashboardList || !dashboardInfoImage || !dashboardInfoText) {
        return;
    }

    dashboardList.querySelectorAll("button").forEach((button, buttonIndex) => {
        button.classList.toggle("active", buttonIndex === index);
    });

    dashboardInfoImage.src = selected.image;
    dashboardInfoImage.alt = selected.name;
    dashboardInfoText.textContent = selected.text;
}

function renderDashboardList(mode) {
    if (!dashboardList || !dashboardListTitle) {
        return;
    }

    dashboardMode = mode;
    if (dashboardView) {
        dashboardView.dataset.dashboardMode = mode;
    }
    dashboardListTitle.textContent = mode === "houses" ? "HOUSES" : "CHARACTERS";
    dashboardList.innerHTML = "";

    dashboardItems[mode].forEach((item, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = item.name;
        button.addEventListener("click", () => renderDashboardItem(index));
        dashboardList.appendChild(button);
    });

    dashboardTabs.forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.dashboardTab === mode);
    });

    renderDashboardItem(0);
}

function buildDashboardCharacters(characters) {
    const wantedNames = [
        "Asta",
        "Yuno Grinberryall",
        "Noelle Silva",
        "Yami Sukehiro",
        "Nacht Faust",
        "Secre Swallowtail",
        "Vanessa Enoteca",
        "Luck Voltia",
        "Magna Swing",
        "Charmy Pappitson",
        "Finral Roulacase",
        "Gauche Adlai",
        "Grey",
        "Gordon Agrippa",
        "Mimosa Vermillion",
        "Leopold Vermillion",
        "Fuegoleon Vermillion",
        "Mereoleona Vermillion",
        "Charlotte Roselei",
        "Nozel Silva",
        "Julius Novachrono",
        "Zora Ideale",
        "Henry Legolant",
        "Liebe",
        "Dante Zogratis",
        "Vanica Zogratis",
        "Zenon Zogratis",
        "Lolopechka",
        "Rill Boismortier",
        "Dorothy Unsworth",
        "Jack the Ripper",
        "Langris Vaude",
        "William Vangeance",
        "Patri",
        "Ladros",
        "Mars",
        "Fana",
        "Vetto",
        "Licht"
    ];

    return wantedNames.map((wantedName) => {
        const match = characters.find(({ character }) => {
            const name = character.name.toLowerCase();
            const target = wantedName.toLowerCase();
            return name === target
                || name.includes(target)
                || target.includes(name)
                || (wantedName === "Secre Swallowtail" && name.includes("secre"))
                || (wantedName === "Patri" && (name.includes("patri") || name.includes("licht")))
                || (wantedName === "William Vangeance" && name.includes("vangeance"));
        });

        if (!match) {
            return null;
        }

        const displayName = wantedName === "Secre Swallowtail" ? "NERO" : match.character.name.toUpperCase();
        const role = match.role ? match.role.toLowerCase() : "personaje";

        return {
            name: displayName,
            image: match.character.images?.jpg?.image_url || LOCAL_IMAGE,
            text: `${match.character.name} aparece como ${role} en Black Clover. Su historia esta conectada con la magia, los grimorios y los Caballeros Magicos.`
        };
    }).filter(Boolean);
}

async function loadDashboardData() {
    if (!dashboardList) {
        return;
    }

    dashboardItems.houses = housesData;

    renderDashboardList("houses");

    try {
        const charactersResponse = await fetch(`${API_URL}/anime/${BLACK_CLOVER_ID}/characters`);

        if (!charactersResponse.ok) {
            throw new Error("No se pudo cargar dashboard remoto.");
        }

        const charactersData = await charactersResponse.json();
        dashboardItems.characters = buildDashboardCharacters(charactersData.data || []);

        if (!dashboardItems.characters.length) {
            dashboardItems.characters = [
                {
                    name: "ASTA",
                    image: LOCAL_IMAGE,
                    text: "Asta es el protagonista de Black Clover y porta un grimorio de cinco hojas con anti-magia."
                }
            ];
        }

        renderDashboardList(dashboardMode);
    } catch (error) {
        dashboardItems.characters = [
            {
                name: "ASTA",
                image: LOCAL_IMAGE,
                text: "No se pudieron cargar los personajes desde la web en este momento."
            }
        ];
        renderDashboardList(dashboardMode);
    }
}

async function loadBlackCloverFacts() {
    if (!factImage) {
        return;
    }

    try {
        const [animeResponse, picturesResponse, charactersResponse] = await Promise.all([
            fetch(`${API_URL}/anime/${BLACK_CLOVER_ID}/full`),
            fetch(`${API_URL}/anime/${BLACK_CLOVER_ID}/pictures`),
            fetch(`${API_URL}/anime/${BLACK_CLOVER_ID}/characters`)
        ]);

        if (!animeResponse.ok || !picturesResponse.ok || !charactersResponse.ok) {
            throw new Error("No se pudo cargar la informacion remota.");
        }

        const animeData = await animeResponse.json();
        const picturesData = await picturesResponse.json();
        const charactersData = await charactersResponse.json();

        blackCloverFacts = buildAnimeFacts(
            animeData.data,
            picturesData.data || [],
            charactersData.data || []
        );

        currentFact = Math.floor(Math.random() * blackCloverFacts.length);
        renderFact(currentFact);
    } catch (error) {
        blackCloverFacts = [
            {
                detail: LOCAL_IMAGE,
                title: "Sin conexion",
                body: "Black Clover",
                footer: "no pudo cargar datos web"
            }
        ];
        renderFact(0);
    }
}

if (previous && next) {
    previous.addEventListener("click", () => {
        if (!blackCloverFacts.length) return;
        currentFact = (currentFact - 1 + blackCloverFacts.length) % blackCloverFacts.length;
        renderFact(currentFact);
    });

    next.addEventListener("click", () => {
        if (!blackCloverFacts.length) return;
        currentFact = (currentFact + 1) % blackCloverFacts.length;
        renderFact(currentFact);
    });
}

dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        if (!blackCloverFacts[index]) return;
        currentFact = index;
        renderFact(currentFact);
    });
});

dashboardTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        renderDashboardList(tab.dataset.dashboardTab);
    });
});

menuTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
        setMenuOpen(!sideMenu.classList.contains("is-open"));
    });
});

if (menuBackdrop) {
    menuBackdrop.addEventListener("click", () => {
        setMenuOpen(false);
    });
}

if (sideMenu) {
    sideMenu.addEventListener("click", (event) => {
        if (event.target === sideMenu) {
            setMenuOpen(false);
        }
    });
}

if (loginPanel) {
    loginPanel.addEventListener("submit", (event) => {
        event.preventDefault();
        window.location.href = "dashboard.html";
    });
}

if (registerPanel) {
    registerPanel.addEventListener("submit", (event) => {
        event.preventDefault();
        window.location.href = "dashboard.html";
    });
}

document.addEventListener("click", (event) => {
    if (!sideMenu) {
        return;
    }

    const isOpen = sideMenu.classList.contains("is-open");
    const clickedMenu = sideMenu.contains(event.target);
    const clickedTrigger = menuTriggers.some((trigger) => trigger.contains(event.target));

    if (isOpen && !clickedMenu && !clickedTrigger) {
        setMenuOpen(false);
    }
});

loadBlackCloverFacts();
loadDashboardData();

// Logout button
const logoutBtn = document.querySelector(".side-menu-logout");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        window.location.href = "login.html";
    });
}

// Links del menú dashboard que cambian de tab
document.querySelectorAll(".side-menu-item[data-tab]").forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;
        renderDashboardList(tab);
        setMenuOpen(false);
    });
});
