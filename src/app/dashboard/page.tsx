"use client";

import { useEffect, useState } from "react";

export default function PokemonTable() {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10");
        const data = await response.json();

        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon: any) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();
            return {
              id: details.id,
              name: details.name,
              image: details.sprites.front_default,
              type: details.types[0]?.type.name || "Unknown",
              weight: details.weight,
              height: details.height,
              abilities: details.abilities.map((ab: any) => ab.ability.name).join(", "),
            };
          })
        );

        setPokemons(pokemonDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl">
        <h1 className="text-2xl font-bold text-center mb-6">Pokémon Table</h1>

        {loading ? (
          <p className="text-center">Loading Pokémon...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-yellow-500  text-white">
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Image</th>
                <th className="p-3">Type</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {pokemons.map((pokemon) => (
                <tr key={pokemon.id} className="border-b text-center hover:bg-orange-100 cursor-pointer delay-75">
                  <td className="p-3">{pokemon.id}</td>
                  <td className="p-3 capitalize">{pokemon.name}</td>
                  <td className="p-3">
                    <img src={pokemon.image} alt={pokemon.name} className="h-12 w-12 mx-auto" />
                  </td>
                  <td className="p-3 capitalize">{pokemon.type}</td>
                  <td className="p-3">
                    <button
                      onClick={() =>
                        alert(
                          `Name: ${pokemon.name.toUpperCase()}\nType: ${pokemon.type}\nHeight: ${pokemon.height}\nWeight: ${pokemon.weight}\nAbilities: ${pokemon.abilities}`
                        )
                      }
                      className="bg-orange-300 text-white px-4 py-1 rounded-lg hover:bg-yellow-600 delay-75"
                    >
                      More Info
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
