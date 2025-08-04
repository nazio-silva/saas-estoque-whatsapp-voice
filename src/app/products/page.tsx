/* eslint-disable @typescript-eslint/no-explicit-any */
// estoque-saas/frontend/app/products/page.jsx (ou .tsx)
'use client'; // <-- INDICA QUE ESTE É UM COMPONENTE DE CLIENTE

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Head from 'next/head';
import axios from 'axios'; // <-- Importe o Axios

// Você pode usar CSS Modules (import styles from './ProductList.module.css';)
// ou importar seus estilos globais.
// Vamos usar classes CSS diretamente para simplicidade, assumindo que estão em globals.css.

function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // Estado para o valor do campo de pesquisa

    const router = useRouter();
    const searchParams = useSearchParams();

    // Obtenha o termo de pesquisa inicial da URL
    const initialSearchFromUrl = searchParams.get('search') || '';

    // Usamos useCallback para memorizar a função de busca e evitar recriações desnecessárias
    const fetchProducts = useCallback(async (search = '') => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) {
                router.push('/login');
                return;
            }

            // A URL para a API. Se você configurou um proxy no next.config.js,
            // pode usar '/api/products'. Caso contrário, use a URL completa do backend.
            // Ex: const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const url = '/products';
            
            // Adiciona o termo de pesquisa como um parâmetro de query
            const params = {
                search: search || undefined // Envia 'search' apenas se houver valor
            };

            console.log(`URL: ${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`)

            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                params: params // Axios adiciona automaticamente os parâmetros de query à URL
            });

            console.log('response')
            console.log(response)

            setProducts(response.data); // Axios coloca a resposta no 'data'
            
        } catch (err) {
            // Tratamento de erros do Axios
            if (axios.isAxiosError(err)) {
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('jwt_token');
                    router.push('/login');
                    setError('Sessão expirada ou não autorizada. Faça login novamente.');
                } else {
                    setError(err.response?.data?.message || err.message || 'Falha ao carregar produtos.');
                }
            } else {
                setError('Um erro inesperado ocorreu.');
            }
            console.error('Erro ao buscar produtos:', err);
        } finally {
            setLoading(false);
        }
    }, [router]); // router como dependência do useCallback

    // Efeito para carregar produtos quando o componente monta ou o termo de pesquisa muda na URL
    useEffect(() => {
        // Inicializa o estado local da pesquisa com o valor da URL
        if (initialSearchFromUrl !== searchQuery) {
            setSearchQuery(initialSearchFromUrl);
        }
        fetchProducts(initialSearchFromUrl); // Chama a busca com o valor da URL
    }, [initialSearchFromUrl, fetchProducts]); // initialSearchFromUrl e fetchProducts como dependências

    // Handle para o campo de pesquisa
    const handleSearchChange = (e: any) => {
        const newSearchValue = e.target.value;
        setSearchQuery(newSearchValue); // Atualiza o estado local do campo

        // Atualiza a URL para refletir a busca. Isso vai disparar o useEffect e refetch os produtos.
        const newSearchParams = new URLSearchParams(searchParams.toString());
        if (newSearchValue) {
            newSearchParams.set('search', newSearchValue);
        } else {
            newSearchParams.delete('search'); // Remove o parâmetro se a pesquisa estiver vazia
        }
        router.push(`/products?${newSearchParams.toString()}`);
    };


    if (loading) return <div className="loading">Carregando produtos...</div>;
    if (error) return <div className="error">Erro: {error}</div>;

    return (
        <div className="product-list-container">
            <Head>
                <title>Meus Produtos - Estoque SaaS</title>
            </Head>

            <h2>Meus Produtos Cadastrados</h2>
            
            {/* <div className="search-bar-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder={"Buscar produto por nome..."}
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                </div> */}

{products.length === 0 ? (
                <p className="no-products-message">Nenhum produto encontrado. Tente ajustar sua pesquisa ou adicione um novo produto!</p>
            ) : (
                <div className="table-responsive"> {/* Container para responsividade da tabela */}
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Quantidade</th>
                                <th>Preço</th>
                                <th>Descrição</th>
                                {/* Adicione mais cabeçalhos se tiver outros campos */}
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product: any) => (
                                <tr key={product._id}>
                                    <td>{product.name}</td>
                                    <td>{product.quantity}</td>
                                    <td>R$ {product.price ? product.price.toFixed(2) : 'N/A'}</td>
                                    <td>{product.description || '-'}</td> {/* Exibe '-' se não houver descrição */}
                                    {/* Adicione mais células para outros campos */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ProductListPage;