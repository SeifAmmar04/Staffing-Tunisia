"use client";

import { useState } from "react";

const jobsData = [
  {
    id: 1,
    title: "Développeur Full Stack",
    location: "Tunis",
    type: "CDI",
    category: "Tech",
  },
  {
    id: 2,
    title: "Chargé RH",
    location: "Sfax",
    type: "CDD",
    category: "RH",
  },
  {
    id: 3,
    title: "Data Analyst",
    location: "Remote",
    type: "Freelance",
    category: "Tech",
  },
];

export default function CareersPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");

  const filteredJobs = jobsData.filter((job) => {
    return (
      job.title.toLowerCase().includes(search.toLowerCase()) &&
      (type ? job.type === type : true) &&
      (location ? job.location === location : true)
    );
  });

  return (
    <section className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* TITLE */}
        <h1 className="text-4xl font-bold mb-10 text-center">
          Offres d'emploi
        </h1>

        {/* FILTERS */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-10 grid md:grid-cols-4 gap-4">
          
          {/* Search */}
          <input
            type="text"
            placeholder="Rechercher un poste..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 border rounded-xl"
          />

          {/* Type */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="p-3 border rounded-xl"
          >
            <option value="">Type de contrat</option>
            <option>CDI</option>
            <option>CDD</option>
            <option>Freelance</option>
          </select>

          {/* Location */}
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="p-3 border rounded-xl"
          >
            <option value="">Localisation</option>
            <option>Tunis</option>
            <option>Sfax</option>
            <option>Remote</option>
          </select>

          {/* Reset */}
          <button
            onClick={() => {
              setSearch("");
              setType("");
              setLocation("");
            }}
            className="bg-gray-200 rounded-xl"
          >
            Réinitialiser
          </button>
        </div>

        {/* JOB LIST */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-2">
                  {job.title}
                </h3>

                <div className="text-sm text-gray-500 mb-4">
                  📍 {job.location} • {job.type}
                </div>

                <span className="inline-block text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full mb-4">
                  {job.category}
                </span>

                <button className="text-red-600 font-semibold hover:underline">
                  Voir détails →
                </button>
              </div>
            ))
          ) : (
            <p className="text-center col-span-2 text-gray-500">
              Aucune offre trouvée 😢
            </p>
          )}
        </div>

      </div>
    </section>
  );
}