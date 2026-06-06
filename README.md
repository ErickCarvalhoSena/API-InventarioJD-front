# 🚜 Oficina RGF — Sistema de Estoque de Peças (Frontend)

Sistema web de gerenciamento de estoque de peças para tratores e colhedoras John Deere, desenvolvido para a Oficina RGF.

## 📋 Sobre o Projeto

A Oficina RGF especializada em tratores e colhedoras John Deere precisava de uma forma de controlar o estoque de peças. Sem um sistema, era comum comprar peças que já existiam no estoque ou perder vendas por não saber o que tinha disponível.

Este sistema resolve esse problema com uma interface simples e rápida para consulta e gerenciamento do estoque.

## ✨ Funcionalidades

- 🔍 Pesquisa de peças em tempo real por código (busca parcial)
- 🚜 Filtro por modelo de máquina (tratores e colhedoras)
- ➕ Cadastro de novas peças com modelos compatíveis
- ✏️ Edição de peças existentes
- 🗑️ Exclusão individual ou múltipla de peças
- 📊 Ordenação por descrição (A→Z, Z→A) e quantidade
- 🔗 Link direto para o catálogo oficial John Deere

## 🛠️ Tecnologias

- [Next.js 15] — framework React
- [TypeScript] — tipagem estática
- [Tailwind CSS] — estilização
- [React Hooks] — `useState`, `useEffect`

## 🚀 Como Rodar

### Pré-requisitos

- Node.js 18+
- API do projeto rodando ([repositório da API](https://github.com/ErickCarvalhoSena/API-InventarioJD))

### Instalação

```bash
# Clone o repositório
git clone https://github.com/ErickCarvalhoSena/API-InventarioJD-front.git

# Entre na pasta
cd API-InventarioJD-front

# Instale as dependências
npm install

# Rode o projeto
npm run dev
```

Acesse `http://localhost:3000` no navegador.

## 📁 Estrutura do Projeto

```
oficina-jd-web/
├── src/
│   └── app/
│       ├── page.tsx        # Página principal
│       ├── layout.tsx      # Layout base
│       └── globals.css     # Estilos globais
└── public/
    └── colheitadeira.png   # Ícone de colhedora
```

## 🔗 Repositórios Relacionados

- [API — OficinaJD.API](https://github.com/ErickCarvalhoSena/OficinaJD-API)
