import axios from "axios";
import { useEffect, useState } from "react";

function usePokemonList( ) {
  const [pokemonListState, setPokemonListState] = useState({
    pokemonList: [],
    isLoading: true,
    PokedexUrl: 'https://pokeapi.co/api/v2/pokemon',
    nextUrl: '',
    prevUrl: '',
    
  });

  async function downloadPokemons() {
    // setIsLoading(true);
 
    //iterating over the arr of pokemon and using their url , to create an array of promises
    //that will download those 20 pokemons
   
      setPokemonListState((state) => ({ ...state, isLoading: true }));
      const response = await axios.get(pokemonListState.PokedexUrl);
  
      const pokemonResults = response.data.results; //upr ulr ke promises (we get arr of pokemon from result)
  
      console.log("response is=>",response.data.pokemon);
  
      //queueing a series of state update
      setPokemonListState((state) => ({
        ...state,
        nextUrl: response.data.next,
        prevUrl: response.data.previous,
      }));
  

      const pokemonResultPromise = pokemonResults.map((pokemon) =>
        axios.get(pokemon.url)
      );

      //passing that promise arr to axios.all
      const pokemonData = await axios.all(pokemonResultPromise); //arr of 20 pokemon detail data
      console.log(pokemonData);

      //now iterate on the data of each pokemon and extract id, name , image , types
      const PokeListResult = pokemonData.map((pokeData) => {
        const pokemon = pokeData.data;
        return {
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.sprites.other
            ? pokemon.sprites.other.dream_world.front_default
            : pokemon.sprites.front_shiny,
          types: pokemon.types,
        };
      });

      //queueing a series of state update
      setPokemonListState((state) => ({
        ...state,
        pokemonList: PokeListResult,
        isLoading: false,
      }));
    
  }

  useEffect(() => {
    downloadPokemons();
  }, [pokemonListState.PokedexUrl]);

  return [pokemonListState, setPokemonListState];
}
export default usePokemonList;
