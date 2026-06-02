"use client";

import { useState, useEffect } from "react";

interface Peca {
  id: number;
  codigo: string;
  descricao: string;
  quantidade: number;
  localizacao: string;
  modelos: string[];
}

interface Modelo {
  id: number;
  nome: string;
}

export default function Home() {
  const [busca, setBusca] = useState("");
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [modeloSelecionado, setModeloSelecionado] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:5090/api/Modelos")
      .then((res) => res.json())
      .then((data) => setModelos(data));
  }, []);

  useEffect(() => {
    if (busca.length === 0 && !modeloSelecionado) {
      setPecas([]);
      return;
    }

    const timer = setTimeout(async () => {
      let url = `http://localhost:5090/api/Pecas/${busca}`;

      if (modeloSelecionado && busca.length === 0) {
        url = `http://localhost:5090/api/Pecas/modelo/${modeloSelecionado}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPecas(Array.isArray(data) ? data : [data]);
      } else {
        setPecas([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [busca, modeloSelecionado]);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-green-700 text-white text-center py-6">
        <h1 className="text-3xl font-bold">Oficina RGF</h1>
        <p className="text-green-200">Controle de Estoque de Peças</p>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Pesquisar Peças</h2>

        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col gap-3">
          <select
            className="w-full border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:border-green-500"
            value={modeloSelecionado ?? ""}
            onChange={(e) => setModeloSelecionado(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Todos os modelos</option>
            {modelos.map((modelo) => (
              <option key={modelo.id} value={modelo.id}>
                {modelo.nome}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Digite o código da peça..."
            className="w-full border border-gray-300 rounded p-2 bg-white focus:outline-none focus:border-green-500 text-gray-900"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {pecas.length === 0 ? (
          <p className="text-gray-500">Nenhuma peça encontrada.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {pecas.map((peca) => (
              <div key={peca.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-green-700">{peca.codigo}</h3>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    Qtd: {peca.quantidade}
                  </span>
                </div>
                <p className="text-gray-600">{peca.descricao}</p>
                <p className="text-sm text-gray-400">📍 {peca.localizacao}</p>
                <p className="text-sm text-gray-400">🚜 {peca.modelos.join(", ")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}