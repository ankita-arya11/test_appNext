"use client";

import { useEffect, useState } from "react";
import { pokemonData } from "../data/pokemon";

export default function Dashboard() {
    const [userOrganization, setUserOrganization] = useState<string | null>(null);
    const [likedPokemons, setLikedPokemons] = useState<number[]>([]);

    useEffect(() => {
        const userOrg = localStorage.getItem("userOrganization");
        if(userOrg) {
            setUserOrganization(userOrg);
        }
    },[]);

    const toggleLike = (id:number) => {
        setLikedPokemons((prev) => 
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    };

    const filteredPokemons = pokemonData.filter(
        (pokemon) => pokemon.organization === userOrganization
    );

    return (
        <div className="min-h-screen p-8 bg-gray-100">
          <h1 className="text-2xl font-bold text-center mb-6">Pokémon dashboard</h1>
          {userOrganization ? (
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="p-3">Name</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPokemons.map((pokemon) => (
                    <tr key={pokemon.id} className="border-b">
                      <td className="p-3 text-center">{pokemon.name}</td>
                      <td className="p-3 text-center">{pokemon.type}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => toggleLike(pokemon.id)}
                          className={`px-4 py-1 rounded ${
                            likedPokemons.includes(pokemon.id)
                              ? "bg-red-500 text-white"
                              : "bg-gray-300"
                          }`}
                        >
                          {likedPokemons.includes(pokemon.id) ? "Unlike" : "Like"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">Loading your organization data...</p>
          )}
        </div>
      );
    }