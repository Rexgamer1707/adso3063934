import {Routes, Route, Link, useParams} from 'react-router-dom';
import BtnBack from "../components/BtnBack";
import CardPokemon from "../components/CardPokemon";

// static pokemon sample data for list
const STATIC_POKEMONS = [
    { name: 'Pikachu', type: 'Electric', power: 112, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' },
    { name: 'Charmander', type: 'Fire', power: 62, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png' },
    { name: 'Squirtle', type: 'Water', power: 63, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png' },
    { name: 'Bulbasaur', type: 'Grass', power: 64, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' },
    { name: 'Jigglypuff', type: 'Normal', power: 95, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png' },
    { name: 'Gengar', type: 'Ghost', power: 225, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png' },
];

function GeneralInfo () {
    return(
        <div>
            <h2>General Info</h2>
            <p>This is the home state; no pokemon data shown.</p>
        </div>
    )    
}

function PokemonList () {
    const pokemons = STATIC_POKEMONS;
    const styles = {
        cards: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
            padding: "20px"
        }
    };

    return(
        <div>
            <h2>Pokemon List</h2>
            <div style={styles.cards}>
                {pokemons.map(p => (
                    <Link key={p.name} to={`/example7/details/${p.name}`} className="example7-link" style={{display:'block', textDecoration:'none'}}>
                        <CardPokemon
                            name={p.name}
                            type={p.type}
                            power={p.power}
                            image={p.image}
                        />
                    </Link>
                ))}
            </div>
        </div>
    )
}


function PokemonDetails () {
    const { name } = useParams();
    const pokemon = STATIC_POKEMONS.find(p => p.name.toLowerCase() === name?.toLowerCase());
    if (!pokemon) {
        return <div><h2>No details available for "{name}"</h2></div>;
    }
    return(
        <div>
            <h2>{pokemon.name} details</h2>
            <img src={pokemon.image} alt={pokemon.name} width={96} height={96} />
            <p>Type: {pokemon.type}</p>
            <p>Power: {pokemon.power}</p>
        </div>
    )
}

function InternalNavigation (){
    return(
        <nav className="example7-nav">
            <Link to="/example7" className="example7-link">Home</Link>
            <Link to="/example7/list" className="example7-link">Pokemon List</Link>
            <Link to="/example7/details/pikachu" className="example7-link">⚡ Pikachu</Link>
        </nav>
    )
}

function Example7Routing() {
    return(
        <div className="container example7-routing">
            <style>{`
                .example7-routing .example7-nav {
                    margin: 12px 0 18px;
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                .pokemon-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px,1fr));
                    gap: 1rem;
                    margin-top: 1rem;
                }
                .example7-routing .example7-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    margin: 0;
                    color: #0b63d6;
                    text-decoration: none;
                    font-weight: 700;
                    padding: 10px 14px;
                    border-radius: 12px;
                    background: #f3f8ff;
                    border: 1px solid rgba(11,99,214,0.12);
                    box-shadow: 0 6px 12px rgba(11,99,214,0.06);
                    transition: transform .18s cubic-bezier(.2,.9,.2,1), box-shadow .18s, background .12s, color .12s;
                    will-change: transform;
                }
                .example7-routing .example7-link:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 18px 30px rgba(11,99,214,0.14);
                    background: linear-gradient(180deg,#eaf5ff,#d6efff);
                }
                .example7-routing .example7-link:active {
                    transform: translateY(-2px) scale(.995);
                    box-shadow: 0 8px 16px rgba(11,99,214,0.12);
                }
                .example7-routing .example7-link:focus {
                    outline: none;
                    box-shadow: 0 0 0 4px rgba(11,99,214,0.12);
                }
                .example7-routing .example7-link:visited { color: #0b63d6; }
                @media (max-width: 480px) {
                    .example7-routing .example7-link { padding: 8px 10px; border-radius: 10px; }
                }
            `}</style>
            <BtnBack />

            <h2>Example 7: Routing</h2>
            <p>Navigation between diferent 'pages' without reloading the browser</p>
            <InternalNavigation />
            {/* Absolute Paths */}
            <Routes>
                <Route path='/' element={<GeneralInfo />} />
                <Route path='/list' element={<PokemonList />} />
                <Route path='/details/:name' element={<PokemonDetails />} />
            </Routes>
        </div>
    )
}

export default Example7Routing;