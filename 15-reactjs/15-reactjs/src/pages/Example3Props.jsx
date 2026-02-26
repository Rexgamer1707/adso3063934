import BtnBack from "../components/BtnBack";
import CardPokemon from "../components/CardPokemon";

function Example3Props() {

    //Data
    const pokemons = [
        { id: 1, name: "Haxorus", type: "Dragon", power: 540, legendary: false, img: "https://img.pokemondb.net/sprites/scarlet-violet/icon/avif/haxorus.avif" },
        { id: 2, name: "Greninja", type: "Water/Sinister", power: 530, legendary: false, img: "https://img.pokemondb.net/sprites/scarlet-violet/icon/avif/greninja.avif" },
        { id: 3, name: "Infernape", type: "Fire", power: 534, legendary: false, img: "https://img.pokemondb.net/sprites/scarlet-violet/icon/avif/infernape.avif" },
        { id: 4, name: "Mewtwo", type: "Psychic", power: 680, legendary: true, img: "https://img.pokemondb.net/sprites/scarlet-violet/icon/avif/mewtwo.avif" },
        { id: 5, name: "Suicune", type: "Water", power: 580, legendary: true, img: "https://img.pokemondb.net/sprites/scarlet-violet/icon/avif/suicune.avif" },
        { id: 6, name: "Muk", type: "Poison", power: 500, legendary: false, img: "https://img.pokemondb.net/sprites/scarlet-violet/icon/avif/muk.avif"},
        { id: 7, name: "Hoopa", type: "Ghost", power: 600, legendary: true, img: "https://img.pokemondb.net/sprites/scarlet-violet/icon/avif/hoopa.avif" },
        { id: 8, name: "Mega Lucario", type: "Mega", power: 625, legendary: false, img: "https://img.pokemondb.net/sprites/scarlet-violet/icon/avif/lucario-mega.avif"},
        { id: 9, name: "Mega Rayquaza", type: "Mega", power: 780, legendary: true, img: "https://img.pokemondb.net/sprites/scarlet-violet/icon/avif/rayquaza-mega.avif"}
    ];

    //Styles
    const styles = {
        cards: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
            padding: "20px"
        }
    }


    return (
        <div className="container">
            <BtnBack />
            <h2>Example 3: Props</h2>
            <p>Passing data from parent to child components using props.</p>
            <div style={styles.cards}>
                {/* We pass different props to each CardPokemon component */}
                {
                    pokemons.map(pokemon => (
                        <CardPokemon
                            key={pokemon.id}
                            name={pokemon.name}
                            type={pokemon.type}
                            power={pokemon.power}
                            legendary={pokemon.legendary}
                            image={pokemon.img}
                        />
                    ))
                }
            </div>
        </div>
    );
}

export default Example3Props;