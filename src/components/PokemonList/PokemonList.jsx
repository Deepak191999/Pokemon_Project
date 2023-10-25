import { useState, useEffect } from "react";
import axios from "axios";
import "./PokemonList.css";
import Pokemon from "../Pokemon/Pokemon";


function PokemonList() {
 
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
// 
  const [PokedexUrl, setPokedexUrl] = useState('https://pokeapi.co/api/v2/pokemon');   //it download list of 20 pokemon
  const [nextUrl, setNextUrl] = useState('');
  const [prevUrl, setPrevUrl] = useState('');



       async function downloadPokemons() {
        setIsLoading(true);
           const response = await axios.get(PokedexUrl);

         const pokemonResults = response.data.results;       //upr ulr ke promises (we get arr of pokemon from result)
        
         console.log(response.data);
         setNextUrl(response.data.next);
         setPrevUrl(response.data.previous);


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
  }, [PokedexUrl]);

  return (
    <div className="pokemon-list-wrapper">
      <div className="pokemon-wrapper">
      {(isLoading) ? 'Loading....' :
         pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id}/>)
          }
      </div>
      <div className="controls">
        <button disabled={prevUrl == null} onClick={() => setPokedexUrl(prevUrl)} >Prev</button>
        <button disabled={nextUrl == null} onClick={() => setPokedexUrl(nextUrl)}>Next</button>
      </div>
    </div>
  )
}
export default PokemonList;
