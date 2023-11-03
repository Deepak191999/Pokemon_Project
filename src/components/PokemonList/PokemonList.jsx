import { useState, useEffect } from "react";
import axios from "axios";
import "./PokemonList.css";
import Pokemon from "../Pokemon/Pokemon";



function PokemonList() {
 
//   const [pokemonList, setPokemonList] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
// // 
//   const [PokedexUrl, setPokedexUrl] = useState('https://pokeapi.co/api/v2/pokemon');   //it download list of 20 pokemon
//   const [nextUrl, setNextUrl] = useState('');
//   const [prevUrl, setPrevUrl] = useState('');

  const [pokemonListState, setPokemonListState] = useState({
    pokemonList: [],
    isLoading: true,
    PokedexUrl:'https://pokeapi.co/api/v2/pokemon',
    nextUrl: '',
    prevUrl:''
  })

       async function downloadPokemons() {
        // setIsLoading(true);
        setPokemonListState ((state)=>({...state, isLoading: true}))
           const response = await axios.get(pokemonListState.PokedexUrl);

         const pokemonResults = response.data.results;       //upr ulr ke promises (we get arr of pokemon from result)
        
         console.log(response.data);

         //queueing a series of state update
        setPokemonListState( (state)=> ({...state, nextUrl: response.data.next, prevUrl:response.data.previous}));
         


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
         
       
         //queueing a series of state update
        setPokemonListState((state)=>({...state, pokemonList:PokeListResult, isLoading: false}));
    }


  useEffect(() => {
    //default function
    downloadPokemons();
  }, [pokemonListState.PokedexUrl]);

  return (
    <div className="pokemon-list-wrapper">
      <div className="pokemon-wrapper">
      {(pokemonListState.isLoading) ? 'Loading....' :
         pokemonListState.pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} id={p.id}/>)
          }
      </div>
      <div className="controls">
        <button disabled={pokemonListState.prevUrl == null} onClick={() =>
          { const urlToSet = pokemonListState.prevUrl
            setPokemonListState({...pokemonListState, PokedexUrl: urlToSet})}} >Prev</button> 

        <button disabled={pokemonListState.nextUrl == null} onClick={() => {
          const urlToSet = pokemonListState.nextUrl
          setPokemonListState({...pokemonListState, PokedexUrl:urlToSet })}} >Next</button>
      </div>
    </div>
  )
}
export default PokemonList;
