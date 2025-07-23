// =============== src/App.jsx ===============
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// --- Configuração do Axios ---
axios.defaults.baseURL = 'https://price-watcher-pf9z.onrender.com'; // Altere para o URL do seu backend
const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

// --- Ícones SVG para os botões ---
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm-1.57 1.57-1.06-1.06L2.5 12.207l-1.757 3.515a.5.5 0 0 0 .659.659l3.515-1.757L11.284 2.716z"/></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707z"/></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/></svg>;

// --- Componentes da UI ---
const Alert = ({ message, type, onClose }) => {
    if (!message) return null;
    const typeClasses = {
        success: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
        error: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
    };
    return (
        <div className={`p-4 mb-4 text-sm rounded-lg ${typeClasses[type]}`} role="alert">
            <span className="font-medium">{message}</span>
            <button onClick={onClose} className="float-right font-bold text-lg leading-none">&times;</button>
        </div>
    );
};

// Layout para as páginas de autenticação, garantindo a centralização
const AuthPageLayout = ({ children, title }) => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold text-center">{title}</h2>
            {children}
        </div>
    </div>
);

const LoginPage = ({ setView, setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('/auth/login', { email, password });
            setToken(response.data.token);
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao fazer login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthPageLayout title="Login">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <Alert message={error} type="error" onClose={() => setError('')} />}
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <button type="submit" disabled={loading} className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed">
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Não tem uma conta?{' '}
                <button onClick={() => setView('register')} className="font-medium text-indigo-600 hover:underline">Cadastre-se</button>
            </p>
        </AuthPageLayout>
    );
};

const RegisterPage = ({ setView }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const response = await axios.post('/auth/register', { email, password });
            setMessage(response.data.message + " Redirecionando para login...");
            setTimeout(() => setView('login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao cadastrar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthPageLayout title="Criar Conta">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <Alert message={error} type="error" onClose={() => setError('')} />}
                {message && <Alert message={message} type="success" onClose={() => setMessage('')} />}
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <button type="submit" disabled={loading} className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed">
                    {loading ? 'Criando...' : 'Criar Conta'}
                </button>
            </form>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Já tem uma conta?{' '}
                <button onClick={() => setView('login')} className="font-medium text-indigo-600 hover:underline">Faça Login</button>
            </p>
        </AuthPageLayout>
    );
};

const ProductItem = ({ product, fetchProducts }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTargetPrice, setNewTargetPrice] = useState(product.target_price);

    const handleDelete = async () => {
        if (window.confirm(`Tem certeza que deseja excluir "${product.product_name}"?`)) {
            try {
                await axios.delete(`/products/${product.id}`);
                fetchProducts();
            } catch (err) {
                alert('Erro ao excluir produto.');
            }
        }
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`/products/${product.id}`, { target_price: newTargetPrice });
            setIsEditing(false);
            fetchProducts();
        } catch (err) {
            alert('Erro ao atualizar produto.');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{product.product_name}</p>
                <a href={product.product_url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-500 hover:underline">
                    Acessar página do produto
                </a>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-center">
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Preço Atual</p>
                    <p className="font-bold text-lg text-green-600 dark:text-green-400">R$ {parseFloat(product.current_price).toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Seu Alvo</p>
                    {isEditing ? (
                        <input
                            type="number"
                            value={newTargetPrice}
                            onChange={(e) => setNewTargetPrice(e.target.value)}
                            className="w-28 text-center font-bold text-lg text-red-600 dark:text-red-400 bg-gray-100 dark:bg-gray-700 border border-indigo-500 rounded-md"
                        />
                    ) : (
                        <p className="font-bold text-lg text-red-600 dark:text-red-400">R$ {parseFloat(product.target_price).toFixed(2)}</p>
                    )}
                </div>
                <div className="flex gap-2">
                    {isEditing ? (
                        <button onClick={handleUpdate} className="p-2 text-white bg-green-600 rounded-md hover:bg-green-700">Salvar</button>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="p-2 text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"><EditIcon /></button>
                    )}
                    <button onClick={handleDelete} className="p-2 text-white bg-red-600 rounded-md hover:bg-red-700"><DeleteIcon /></button>
                </div>
            </div>
        </div>
    );
};

const Dashboard = ({ setToken, theme, toggleTheme }) => {
    const [products, setProducts] = useState([]);
    const [productUrl, setProductUrl] = useState('');
    const [targetPrice, setTargetPrice] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchProducts = useCallback(async () => {
        try {
            const response = await axios.get('/products');
            setProducts(response.data);
        } catch (err) {
            setError('Não foi possível carregar seus produtos.');
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const response = await axios.post('/products', { product_url: productUrl, target_price: targetPrice });
            setMessage(response.data.message);
            setProductUrl('');
            setTargetPrice('');
            fetchProducts();
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao adicionar produto.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setToken(null);
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100">
            <div className="container mx-auto p-4 md:p-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">📉 PriceWatcher</h1>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                        </button>
                        <button onClick={handleLogout} className="px-4 py-2 font-semibold text-indigo-600 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-200 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-800">Sair</button>
                    </div>
                </header>

                {error && <Alert message={error} type="error" onClose={() => setError('')} />}
                {message && <Alert message={message} type="success" onClose={() => setMessage('')} />}

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Adicionar Novo Produto</h2>
                    <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">URL do Produto</label>
                            <input type="url" placeholder="https://www.loja.com.br/produto/..." value={productUrl} onChange={e => setProductUrl(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Preço Alvo (R$)</label>
                            <input type="number" step="0.01" placeholder="199.90" value={targetPrice} onChange={e => setTargetPrice(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <button type="submit" disabled={loading} className="md:col-start-3 w-full md:w-auto justify-self-end px-6 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed">
                            {loading ? 'Adicionando...' : 'Monitorar'}
                        </button>
                    </form>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Seus Produtos Monitorados</h2>
                    <div className="space-y-4">
                        {products.length > 0 ? products.map(p => (
                            <ProductItem key={p.id} product={p} fetchProducts={fetchProducts} />
                        )) : <p className="text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">Você ainda não está monitorando nenhum produto.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Componente Principal ---
export default function App() {
    const [token, setTokenState] = useState(localStorage.getItem('token'));
    const [view, setView] = useState('login');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const root = window.document.documentElement;
        // Adiciona a classe 'dark' ao elemento <html>
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    useEffect(() => {
      const storedToken = localStorage.getItem('token');
      if(storedToken) {
        setAuthToken(storedToken);
      }
    }, []);

    const setToken = (newToken) => {
        if (newToken) {
            localStorage.setItem('token', newToken);
            setAuthToken(newToken);
        } else {
            localStorage.removeItem('token');
            setAuthToken(null);
        }
        setTokenState(newToken);
    };

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    if (token) {
        return <Dashboard setToken={setToken} theme={theme} toggleTheme={toggleTheme} />;
    }

    if (view === 'register') {
        return <RegisterPage setView={setView} />;
    }

    return <LoginPage setView={setView} setToken={setToken} />;
}
