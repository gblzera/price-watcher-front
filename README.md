# 📉 PriceWatcher - Frontend

Esta é a aplicação frontend para o projeto PriceWatcher. Desenvolvida com React e Vite, ela fornece uma interface de usuário completa para interagir com a API backend, permitindo que os usuários se cadastrem, façam login e gerenciem seus produtos monitorados.

---

## 🚀 Funcionalidades

-   **Interface Responsiva:** Design limpo e funcional que se adapta a diferentes tamanhos de tela.
-   **Modo Claro e Escuro:** Botão para alternar entre os temas claro e escuro.
-   **Autenticação de Usuário:** Telas de Login e Cadastro que se comunicam com a API.
-   **Dashboard Completo:**
    -   Adição de produtos para monitoramento via URL.
    -   Listagem de todos os produtos monitorados.
    -   Funcionalidade para editar o preço alvo ou excluir um produto.
-   **Notificações Visuais:** Alertas para feedback de sucesso ou erro nas operações.

---

## 🛠️ Tecnologias Utilizadas

-   **React** (com Hooks)
-   **Vite** como ferramenta de build e servidor de desenvolvimento.
-   **Tailwind CSS** para estilização.
-   **Axios** para fazer requisições HTTP para a API backend.

---

## ⚙️ Configuração e Execução Local

### 1. Pré-requisitos
- Node.js (v16 ou superior)
- O [servidor backend do PriceWatcher](link-para-seu-repo-backend) deve estar rodando.

### 2. Clone o Repositório
```bash
git clone <url-do-seu-repositorio>
cd price-watcher-frontend
```

### 3. Instale as Dependências
```bash
npm install
```

### 4. Conecte ao Backend
Esta é a etapa mais importante. O frontend precisa saber onde a API está rodando.

Abra o arquivo `src/App.jsx` e encontre a seguinte linha no topo:

```javascript
axios.defaults.baseURL = 'http://localhost:3000';
```

-   Para **desenvolvimento local**, o valor `'http://localhost:3000'` já está correto (assumindo que seu backend está rodando na porta 3000).
-   Para **produção**, você deve substituir este valor pela URL pública da sua API (ex: `'https://sua-api.onrender.com'`).

### 5. Inicie o Servidor de Desenvolvimento
```bash
npm run dev
```
A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).
