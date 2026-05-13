import { useState, useEffect } from "react";
import BtnBack from "../components/BtnBack";

function Example8DataFetching() {
    const [list, setList] = useState([]);
    const [selected, setSelected] = useState(null);
    const [offset, setOffset] = useState(0);
    const [limit] = useState(20);
    const [total, setTotal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // color map based on species types
    const typeColors = {
        normal: "#A8A77A",
        fire: "#EE8130",
        water: "#6390F0",
        electric: "#F7D02C",
        grass: "#7AC74C",
        ice: "#96D9D6",
        fighting: "#C22E28",
        poison: "#A33EA1",
        ground: "#E2BF65",
        flying: "#A98FF3",
        psychic: "#F95587",
        bug: "#A6B91A",
        rock: "#B6A136",
        ghost: "#735797",
        dragon: "#6F35FC",
        dark: "#705746",
        steel: "#B7B7CE",
        fairy: "#D685AD",
    };

    // load list page (names + urls)
    useEffect(() => {
        const loadPage = async () => {
            setLoading(true);
            try {
                const resp = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
                const data = await resp.json();
                setList(data.results);
                if (data.count !== undefined) {
                    setTotal(data.count);
                }
            } catch (err) {
                setError(err.message || "Error al cargar la lista");
            } finally {
                setLoading(false);
            }
        };
        loadPage();
    }, [offset, limit]);

    const loadDetails = async (url) => {
        setLoading(true);
        try {
            const resp = await fetch(url);
            const d = await resp.json();
            setSelected({
                id: d.id,
                name: d.name,
                image: d.sprites.other["official-artwork"].front_default || d.sprites.front_default,
                height: d.height,
                weight: d.weight,
                types: d.types.map((t) => t.type.name).join(", "),
                abilities: d.abilities.map((a) => a.ability.name).join(", "),
            });
        } catch (err) {
            setError(err.message || "Error al cargar los detalles");
        } finally {
            setLoading(false);
        }
    };

    const goPrev = () => {
        if (offset - limit >= 0) setOffset(offset - limit);
    };
    const goNext = () => {
        // don't go past total count
        if (total !== null && offset + limit >= total) return;
        setOffset(offset + limit);
    };

    // styles
    const navButton = {
        padding: "8px 16px",
        border: "none",
        borderRadius: "4px",
        background: "#ffcb05",
        color: "#333",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        transition: "transform .1s",
    };
    const navButtonDisabled = {
        ...navButton,
        background: "#ccc",
        cursor: "not-allowed",
        boxShadow: "none",
    };
    const detailsBox = {
        flex: 1,
        border: "2px solid #ffcb05",
        padding: "24px",
        borderRadius: "12px",
        background: selected
            ? typeColors[selected.types.split(",")[0].trim()] || "rgba(0,0,0,0.6)"
            : "rgba(0,0,0,0.6)",
        color: "#fff",
        minHeight: "400px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    };
    const pokemonItem = {
        cursor: "pointer",
        padding: "6px",
        textAlign: "center",
        border: "1px solid #666",
        borderRadius: "4px",
        background: "rgba(0,0,0,0.2)",
        transition: "background .2s",
    };

    return (
        <div className="container" style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
                <BtnBack />
                <h2>Example 8: Data Fetching</h2>
                <p>Connect with external APIs to get real data.</p>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <div style={{ marginBottom: "10px" }}>
                    <button
                        onClick={goPrev}
                        disabled={offset === 0}
                        style={offset === 0 ? { ...navButtonDisabled, marginRight: "5px" } : { ...navButton, marginRight: "5px" }}
                        onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
                        onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                        ◀ Previous
                    </button>
                    <button
                        onClick={goNext}
                        disabled={total !== null && offset + limit >= total}
                        style={total !== null && offset + limit >= total ? navButtonDisabled : navButton}
                        onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
                        onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                        Next ▶
                    </button>
                    <span style={{ marginLeft: "10px", color: "#ffcb05", fontWeight: "bold" }}>Page {offset / limit + 1}</span>
                </div>

                {loading && <p>Loading pokémon...</p>}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(120px,1fr))",
                        gap: "8px",
                        maxHeight: "60vh",
                        overflowY: "auto",
                        border: "1px solid #ccc",
                        padding: "8px",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.1)",
                    }}
                >
                    {list.map((p) => {
                        const id = p.url.split("/").filter(Boolean).pop();
                        return (
                            <div
                                key={p.name}
                                onClick={() => loadDetails(p.url)}
                                style={pokemonItem}
                                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.4)"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.2)"}
                            >
                                <small style={{ fontWeight: "bold", color: "#ffcb05" }}>#{id}</small>
                                <div style={{ fontSize: "0.9rem", textTransform: "capitalize" }}>{p.name}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={detailsBox}>
                <h3>Details</h3>
                {selected ? (
                    <div>
                        <img src={selected.image} alt={selected.name} style={{ width: "120px", display: "block", margin: "0 auto" }} />
                        <h4 style={{ textTransform: "capitalize", color: "#ffcb05" }}>{selected.name}</h4>
                        <p>Height: {selected.height} dm</p>
                        <p>Weight: {selected.weight} hg</p>
                        <p>Types: {selected.types}</p>
                        <p>Abilities: {selected.abilities}</p>
                    </div>
                ) : (
                    <p>Select a Pokémon</p>
                )}
            </div>
        </div>
    );
}

export default Example8DataFetching;