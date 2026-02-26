import './CardPokemon.css';

function CardPokemon({ name, type, power, image, legendary = false, level }) {

    const typeColors = {
        "Ghost": "#6A0DAD",
        "Psychic": "#FF69B4",
        "Fire": "#f94332",
        "Water": "#1E90FF",
        "Dragon": "#FF4500",
        "Poison": "#590556",
        "Mega": "#87ff47",
    }

    return (

        <div
            className={`pokemon-card${legendary ? ' legendary-card' : ''}`}
            style={{ borderColor: typeColors[type] || "#ccc" }}
        >
            <img src={image} alt={name} className='pokemon-image' />
            <h3>{name}</h3>
            <p className='pokemon-type'>Type: {type}</p>
            <p className='pokemon-power'>Power: {power}</p>

            {level !== undefined && (
                <p className='pokemon-level'>Level: {level}</p>
            )}

            {legendary && <span className='legendary-badge'>⭐Legendary⭐</span>}
        </div>
    );
}

export default CardPokemon;