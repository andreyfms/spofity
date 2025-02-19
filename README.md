
# Radio Browser Challenge 

>  This is a challenge by [Coodesh](https://coodesh.com/)

# 📻 Spofity Radio 

*"Porque a nostalgia do rádio merece um upgrade moderno!"*  

---

## Visão Geral

Spofity é uma aplicação web que consome a API do Radio Browser que permite ao usuário:
- Editar informações (nome, país, idioma) das rádios.
- Ouvir e parar a reprodução de uma rádio ao clicar nos botões correspondentes.
- Pesquisar rádios por nome, país ou idioma, com paginação (10 rádios por página).
- Manter os dados salvos entre sessões.

---

## 🚀 Tecnologias Utilizadas

- **🎛️ Frontend:** Vue 3 + Vite (pra velocidade e organização)  
- **🎨 Estilos:** Tailwind CSS 4
- **🔄 Estado:** Pinia 
- **📡 API:** Axios 
- **🔊 Áudio:** Composables customizados (só uma rádio toca por vez, sem bagunça)  
- **💾 Persistência:** LocalStorage (sim, dá pra evoluir pra API + Redis depois)  
- **🧪 Testes:** Vitest (porque código sem teste é código quebrado amanhã)  
- **🐳 Deploy:** Docker + Nginx 

---
## 🧩 Desafios & Soluções 

### **1. "Todas as rádios tocando ao mesmo tempo? Não, valeu!"**  
- **Solução:** `audioManager` (um composable que vira o DJ e controla quem toca).  

### **2. "MVP != Gambiarra:"**  
- **Solução:** Pinia + `localStorage` (mas já deixei a porta aberta pra migrar pra API).  

### **3. "Estilizar sem criar 50 arquivos CSS? Yes, please!"** 
- **Solução:** Tailwind é vida  
---

## Como Rodar o Projeto

1. **Clone o repositório**

   ```bash
   git clone https://github.com/andreyfms/spofity.git
   cd spofity

2. **Instale as dependências**
    
   ```bash
   npm install

3. **Inicie o servidor de desenvolvimento**

   ```bash
   npm run dev

## Rodando os testes

1. **Para executar os testes, use:**

   ```bash
   npm run test

## Deploy

1. **Build da imagem**

   ```bash
   docker build -t spofity .

2. **Executando o container**

   ```bash
   docker run -p 80:80 spofity
