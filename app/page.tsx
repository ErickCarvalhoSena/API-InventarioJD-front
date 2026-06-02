"use client";

import { useState, useEffect } from "react";

interface Peca{
  id: number;
  codigo: string;
  descricao: string;
  quantidade: number;
  localizacao: string;
  modelos: string[];
}

export default function Home(){
  const [busca, setBusca] = useState("");
  const [pecas, SetPecas] = useState<Peca[]>([]);

  useEffect(() => {
    if (busca.length === 0) {
      SetPecas([]);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await fetch(`http://localhost:5090/api/Pecas/${busca}`);
      if(res.ok){
        const data = await res.json();
        SetPecas([data]);
      } else {
        SetPecas([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [busca]);

  return(
      <main className="min-h-screen bg-gray-100">
        <div className="bg-green-700 text-white text-center py-6">
          <h1 className="text-3x1 font-bold">Oficina RGF</h1>
          <p className="text-green-200">Controle de Estoque de Peças</p>
        </div>

        <div className="max=w=4x1 mx-auto p-6">
          <h2 className="text-x1 font-semibold mb-4">Pesquisar Peças</h2>

          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <input
              type="text"
              placeholder="Digite o código da peça..."
              className="w-full border rounded p-2"
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
                  <div className="flex justity-between items-center">
                    <h3 className="text-lg font-bold text-green-700">{peca.codigo}</h3>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      Qtd: {peca.quantidade}
                    </span>
                  </div>
                  <p className="text-gray-600">{peca.descricao}</p>
                  <p className="text-sm text-gray-400">📍  {peca.localizacao}</p>
                  <p className="text-sm text-gray-400">🚜  {peca.modelos.join(", ")}</p>
                  </div>
              ))}
              </div>
           )}
        </div>
      </main>
  );
}
