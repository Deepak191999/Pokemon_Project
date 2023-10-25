import { useState, useEffect } from "react";
import axios from "axios";
import "./PokemonList.css";
import Pokemon from "../Pokemon/Pokemon";


function PokemonList() {
 
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
// 
  const POKEDEX_URL = 'https://pokeapi.co/api/v2/pokemon';   //it download list of 20 pokemon


       async function downloadPokemons() {
           const response = await axios.get(POKEDEX_URL);

         const pokemonResults = response.data.results;       //upr ulr ke promises (we get arr of pokemon from result)
        
         console.log(response.data);

         //iterating over the arr of pokemon and using their url , to create an array of promises
         //that will download those 20 pokemons
         const pokemonResultPromise =  pokemonResults.map((pokemon) => axios.get(pokemon.url));
       
         //passing that promise arr to axios.all
         const pokemonData = await axios.all(pokemonResultPromise);  //arr of 20 pokemon detail data
        console.log(pokemonData);
       
        //now iterate on the data of each pokemon and extract id, name , image , types
        const PokeListResult = pokemonData.map((pokeData) => {
        const pokemon = pokeData.data;
        return {
          id: pokemon.id,
          name: pokemon.name,
          image: (pokemon.sprites.other) ? pokemon.sprites.other.dream_world.front_default :pokemon.sprites.front_shiny , 
          types: pokemon.types
        }

         } );
         console.log(PokeListResult);
         setPokemonList(PokeListResult);
         setIsLoading(false);
         
          }


  useEffect(() => {
    //default function
    downloadPokemons();
  }, []);

  return (
    <div className="pokemon-list-wrapper">
      <div> Pokemon List </div>
      {(isLoading) ? 'Loading....' :
         pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id}/>)
          }
    </div>
  )
}
export default PokemonList;
