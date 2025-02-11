"use client";

import { useEffect, useState } from "react";

export default function PokemonTable() {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
  const [likedPokemons, setLikedPokemons] = useState<Record<number, boolean>>({});

  const toggleLike = (id: number) => {
    setLikedPokemons((prev) => {
      const updatedLikes = { ...prev, [id]: !prev[id] };
      localStorage.setItem("likedPokemons", JSON.stringify(updatedLikes));
      return updatedLikes;
    });
  };

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      try {
        const page = Math.floor(offset / limit) + 1;
        const response = await fetch(
          `/api/pokemon/getAllPokemonByOrganization?page=${page}&limit=${limit}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Pokémon API Response:", data); 
        setPokemons(data.pokemons || []);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPokemons();
  }, [limit, offset]);

  const fetchPokemonDetails = async (id: number) => {
    try {
      const response = await fetch(`/api/pokemon/getPokemonDetails?id=${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch Pokémon details");
      }
      const data = await response.json();
      setSelectedPokemon(data);
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
    }
  };
  
  

  useEffect(() => {
    const storedLikes = localStorage.getItem("likedPokemons");
    if (storedLikes) {
      setLikedPokemons(JSON.parse(storedLikes));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[url('/bgimage2.jpg')] bg-fixed bg-cover flex flex-col justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl m-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Pokémon Table</h1>

        {loading ? (
          <p className="text-center">Loading Pokémon...</p>
        ) : (
          <div className="overflow-y-auto max-h-[calc(60vh+60px)]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-yellow-500 text-white">
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Image</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Info</th>
                  <th className="p-3">Like</th>
                </tr>
              </thead>
              <tbody>
                {pokemons.map((pokemon) => (
                  <tr
                    key={pokemon.id}
                    className="border-b text-center hover:bg-orange-100"
                  >
                    <td className="p-3">{pokemon.id}</td>
                    <td className="p-3 capitalize">{pokemon.name}</td>
                    <td className="p-3">
                      <img
                        src={pokemon.imageUrl}
                        alt={pokemon.name}
                        className="h-16 w-16 mx-auto"
                      />
                    </td>
                    <td className="p-3 capitalize">{pokemon.type || "N/A"}</td>
                    <td className="p-3">
                      <button
                        onClick={() => fetchPokemonDetails(pokemon.id)}
                        className="bg-orange-300 text-white px-4 py-1 rounded-lg hover:bg-yellow-600"
                      >
                        More Info
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleLike(pokemon.id)}
                        aria-label="Like"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 delay-200"
                          fill={likedPokemons[pokemon.id] ? "red" : "none"}
                          viewBox="0 0 24 24"
                          stroke={
                            likedPokemons[pokemon.id] ? "red" : "currentColor"
                          }
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border p-2 rounded-md w-24"
            min="1"
          />
          <div>
            <button
              onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
              disabled={offset === 0}
              className="bg-yellow-700 text-white px-4 py-2 rounded-lg mx-2 disabled:bg-gray-300"
            >
              Previous
            </button>
            <button
              onClick={() => setOffset((prev) => prev + limit)}
              className="bg-yellow-700 text-white px-4 py-2 rounded-lg"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selectedPokemon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[500px] text-center relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setSelectedPokemon(null)}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold capitalize mb-4">
              {selectedPokemon.name}
            </h2>
            <img
              src={selectedPokemon.imageUrl}
              alt={selectedPokemon.name}
              className="h-48 w-48 mx-auto my-4"
            />
            <p className="text-lg">
              <strong>Type:</strong> {selectedPokemon.type || "N/A"}
            </p>
            <p className="text-lg">
              <strong>Height:</strong> {selectedPokemon.height || "N/A"}
            </p>
            <p className="text-lg">
              <strong>Weight:</strong> {selectedPokemon.weight || "N/A"}
            </p>
            <p className="text-lg">
              <strong>Abilities:</strong> {selectedPokemon.abilities || "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
