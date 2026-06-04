"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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
  codigoJD?: string;
  tipo?: string;
}

export default function Home() {
  const [busca, setBusca] = useState("");
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [modeloSelecionado, setModeloSelecionado] = useState<number | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [pecasSelecionadas, setPecasSelecionadas] = useState<number[]>([]);
  const [ordenacao, setOrdenacao] = useState("padrao");
  const [pecaEditando, setPecaEditando] = useState<Peca | null>(null);
  const [form, setForm] = useState({
    codigo: "",
    descricao: "",
    quantidade: 0,
    localizacao: "",
    modeloIds: [] as number[],
  });

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

  async function deletarPeca(id: number) {
    if (!confirm("Tem certeza que deseja excluir esta peça?")) return;

    await fetch(`http://localhost:5090/api/Pecas/${id}`, {
      method: "DELETE",
    });

    setPecas(pecas.filter((p) => p.id !== id));
  }

  function abrirEdicao(peca: Peca) {
    setPecaEditando(peca);
    setForm({
      codigo: peca.codigo,
      descricao: peca.descricao ?? "",
      quantidade: peca.quantidade,
      localizacao: peca.localizacao ?? "",
      modeloIds: modelos
        .filter((m) => peca.modelos.includes(m.nome))
        .map((m) => m.id),
    });
    setModalAberto(true);
  }

  function abrirCadastro() {
    setPecaEditando(null);
    setForm({ codigo: "", descricao: "", quantidade: 0, localizacao: "", modeloIds: [] });
    setModalAberto(true);
  }

  async function salvarPeca() {
    const body = {
      codigo: form.codigo,
      descricao: form.descricao,
      quantidade: form.quantidade,
      localizacao: form.localizacao,
      modeloIds: form.modeloIds,
    };

    if (pecaEditando) {
      await fetch(`http://localhost:5090/api/Pecas/${pecaEditando.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("http://localhost:5090/api/Pecas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    setModalAberto(false);
    setBusca("");
    setModeloSelecionado(null);
    setPecas([]);
  }

  async function deletarSelecionadas() {
    if(!confirm(`Tem certeza que deseja excluir ${pecasSelecionadas.length} peça(s)?`)) return;

    for(const id of pecasSelecionadas) {
      await fetch (`http://localhost:5090/api/Pecas/${id}`, {
        method: "DELETE",
      });
    }

    setPecas(pecas.filter((p) => !pecasSelecionadas.includes(p.id)));
    setPecasSelecionadas([]);
  }

  const pecasOrdenadas = [...pecas].sort((a, b) => {
    if(ordenacao === "az") return a.descricao.localeCompare(b.descricao);
    if(ordenacao === "za") return b.descricao.localeCompare(a.descricao);
    if(ordenacao === "maior") return b.quantidade - a.quantidade;
    if(ordenacao === "menor") return a.quantidade - b.quantidade;
    return 0;
  });

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-green-700 text-white text-center py-6">
        <h1 className="text-3xl font-bold">Oficina RGF</h1>
        <p className="text-green-200">Controle de Estoque de Peças</p>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Pesquisar Peças</h2>

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

          {modeloSelecionado && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
            {modelos.find((m) => m.id === modeloSelecionado)?.tipo === "colhedora" ? (
              <Image src="/colheitadeira.png" alt="colhedora" width={20} height={20} />
            ) : (
              <span>🚜</span>
            )}
            <span>{modelos.find((m) => m.id === modeloSelecionado)?.nome}</span>
            </div>
          )}

          {modeloSelecionado && modelos.find((m) => m.id === modeloSelecionado)?.codigoJD && (
            <a
              href={`https://partscatalog.deere.com/jdrc/navigation/equipment/${modelos.find((m) => m.id === modeloSelecionado)?.codigoJD}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-700 underline hover:text-green-900"
            >
              🔗 Ver catálogo John Deere
            </a>
          )}

          <input
            type="text"
            placeholder="Digite o código da peça..."
            className="w-full border border-gray-300 rounded p-2 bg-white focus:outline-none focus:border-green-500 text-gray-900"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <button
          onClick={abrirCadastro}
          className="mb-4 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          + Adicionar Peça
        </button>

        {pecasSelecionadas.length > 0 && (
          <button
             onClick={deletarSelecionadas}
             className="mb-4 ml-2 px-4 py-2 rounded font-semibold bg-red-100 text-red-700 hover:bg-red-200"
             >
              Excluir selecionadas ({pecasSelecionadas.length})
             </button>
        )}
           <select 
              className="mb-4 ml-2 border border-gray-700 rounded p-2 text-gray-900 focus:outline-none focus:border-green-500"
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value)}
              >
                <option value="padrao">Ordenar por...</option>
                <option value="az">Descrição A - Z</option>
                <option value="za">Descrição Z - A</option>
                <option value="maior">Maior estoque</option>
                <option value="menor">Menor estoque</option>
              </select>

        {pecasOrdenadas.length === 0 ? (
          <p className="text-gray-500">Nenhuma peça encontrada.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {pecasOrdenadas.map((peca) => (
              <div key={peca.id} className="bg-white rounded-lg shadow p-4">
                
                <input
                 type="checkbox"
                 className="mb-2"
                 checked={pecasSelecionadas.includes(peca.id)}
                 onChange={(e) => {
                  if(e.target.checked){
                    setPecasSelecionadas([...pecasSelecionadas, peca.id]);
                  } else {
                     setPecasSelecionadas(pecasSelecionadas.filter((id) => id !== peca.id));
                  }
                 }}
                 />
                 
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-green-700">{peca.codigo}</h3>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    Qtd: {peca.quantidade}
                  </span>
                </div>
                <p className="text-gray-600">{peca.descricao}</p>
                <p className="text-sm text-gray-400">📍 {peca.localizacao}</p>
                <p className="text-sm text-gray-400">🚜 {peca.modelos.join(", ")}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => deletarPeca(peca.id)}
                    className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                  >
                    Excluir
                  </button>
                  <button
                    onClick={() => abrirEdicao(peca)}
                    className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              {pecaEditando ? "Editar Peça" : "Nova Peça"}
            </h2>

            <div className="flex flex-col gap-3">
              <input
                placeholder="Código"
                className="border border-gray-300 rounded p-2 text-gray-900"
                value={form.codigo}
                onChange={(e) => setForm({ ...form, codigo: e.target.value })}
              />
              <input
                placeholder="Descrição"
                className="border border-gray-300 rounded p-2 text-gray-900"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              />
              <input
                type="number"
                placeholder="Quantidade"
                className="border border-gray-300 rounded p-2 text-gray-900"
                value={form.quantidade}
                onChange={(e) => setForm({ ...form, quantidade: Number(e.target.value) })}
              />
              <input
                placeholder="Localização"
                className="border border-gray-300 rounded p-2 text-gray-900"
                value={form.localizacao}
                onChange={(e) => setForm({ ...form, localizacao: e.target.value })}
              />

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Modelos compatíveis:</p>
                <div className="flex flex-col gap-1 max-h-40 overflow-y-auto border rounded p-2">
                  {modelos.map((modelo) => (
                    <label key={modelo.id} className="flex items-center gap-2 text-sm text-gray-800">
                      <input
                        type="checkbox"
                        checked={form.modeloIds.includes(modelo.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm({ ...form, modeloIds: [...form.modeloIds, modelo.id] });
                          } else {
                            setForm({ ...form, modeloIds: form.modeloIds.filter((id) => id !== modelo.id) });
                          }
                        }}
                      />
                      {modelo.nome}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={salvarPeca}
                  className="flex-1 bg-green-700 text-white py-2 rounded hover:bg-green-800"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setModalAberto(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}