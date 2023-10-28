import Search from "../Search/Search"
import PokemonList from "../PokemonList/PokemonList"
import './Pokedex.css'
function Pokedex(){
return(
    <div className="pokedex-wrapper">
        <Search />
        <PokemonList/>
    </div>
)
}
export default Pokedex