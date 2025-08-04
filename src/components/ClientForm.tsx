// frontend-next/src/components/ClientForm.tsx
'use client'; // Indica que este é um Client Component no Next.js App Router

import React, { useState } from 'react';
import api from '../lib/api'; // Importa a instância do axios configurada
import { useRouter } from 'next/navigation';


export default function ClientForm() {
  const [whatsappJID, setWhatsappJID] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [webhookMethod, setWebhookMethod] = useState<'POST' | 'PUT'>('POST');
  const [webhookFormat, setWebhookFormat] = useState<'JSON' | 'FORM_DATA'>('JSON');
  const [apiToken, setApiToken] = useState<string>('');
  const [plan, setPlan] = useState<'free' | 'basic' | 'premium'>('free');
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState<boolean>(false);


  const userId = localStorage.getItem('user_id');

  const loadClientConfig = async () => {
    if (!userId) {
      setMessage('Por favor, insira o JID do WhatsApp para carregar.');
      setMessageType('error');
      return;
    }
    setLoading(true);
    setMessage('Carregando configurações...');
    setMessageType('');
    try {
      const response = await api.get(`/clients/${userId}`);
      console.log('response')
      
      console.log(response)

      const config = response.data.client;
      if(config.companyName == "") {
        setMessage('Este usuário não possui nenhuma configuração cadastrada.');
        setMessageType('error');
      } else {
        setCompanyName(config.companyName || '');
        setWebhookUrl(config.webhookUrl || '');
        setWebhookMethod(config.webhookMethod || 'POST');
        setWebhookFormat(config.webhookFormat || 'JSON');
        setApiToken(config.apiToken || '');
        setPlan(config.plan || 'free');
        setMessage('Configurações carregadas com sucesso!');
        setMessageType('success');
      }
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Erro ao carregar configurações:', error);
      setMessage(`Nenhuma configuração encontrada para este usuário. Por favor, cadastre uma nova. Erro: ${error.response?.data?.message || error.message}`);
      setMessageType('error');
      // Limpa os campos para um novo cadastro
      setCompanyName('');
      setWebhookUrl('');
      setWebhookMethod('POST');
      setWebhookFormat('JSON');
      setApiToken('');
      setPlan('free');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Processando...');
    setMessageType('');

    

    const payload = {
      userId,
      whatsappJID,
      companyName,
      webhookUrl,
      webhookMethod,
      webhookFormat,
      apiToken,
      plan
    };



    try {
      // Tentar atualizar primeiro
      const updateResponse = await api.put(`/clients/${userId}`, payload);
      setMessage('Configurações atualizadas com sucesso!');
      setMessageType('success');
      console.log('Update Response:', updateResponse.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (updateError: any) {
      // Se a atualização falhar (ex: cliente não existe), tentar cadastrar
      if (updateError.response && updateError.response.status === 404) {
        try {
          const createResponse = await api.post('/clients', payload);
          setMessage('Cliente cadastrado com sucesso!');
          setMessageType('success');
          console.log('Create Response:', createResponse.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (createError: any) {
          console.error('Erro ao cadastrar cliente:', createError);
          setMessage(`Erro ao cadastrar: ${createError.response?.data?.message || createError.message}`);
          setMessageType('error');
        }
      } else {
        console.error('Erro ao atualizar cliente:', updateError);
        setMessage(`Erro ao atualizar: ${updateError.response?.data?.message || updateError.message}`);
        setMessageType('error');
      }
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Configuração de Integração de Estoque por Voz</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
        Informe o JID do WhatsApp (seu número com @s.whatsapp.net) e a URL do seu sistema de estoque para onde os dados devem ser enviados.
      </p>

      {message && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '4px',
          backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
          color: messageType === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${messageType === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{  marginRight: '22px' }}>
          <label htmlFor="whatsappJID" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>JID do WhatsApp (ex: 5521999999999@s.whatsapp.net):</label>
          <input
            type="text"
            id="whatsappJID"
            value={whatsappJID}
            onChange={(e) => setWhatsappJID(e.target.value)}
            required
            placeholder="Ex: 5521999999999@s.whatsapp.net"
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
           <button
             type="button"
             onClick={loadClientConfig}
             disabled={!whatsappJID || loading}
             style={{
               marginTop: '10px',
               padding: '8px 15px',
               backgroundColor: '#007bff',
               color: 'white',
               border: 'none',
               borderRadius: '4px',
               cursor: 'pointer',
               opacity: loading ? 0.7 : 1
             }}
           >
             {loading && message.startsWith('Carregando') ? 'Carregando...' : 'Carregar Configurações Existentes'}
           </button>
        </div>

        <div style={{  marginRight: '22px' }}>
          <label htmlFor="companyName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nome da Empresa:</label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px'}}
          />
        </div>

        <div style={{  marginRight: '22px' }}>
          <label htmlFor="webhookUrl" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>URL do Webhook do seu Sistema de Estoque:</label>
          <input
            type="url"
            id="webhookUrl"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            required
            placeholder="Ex: https://seusistema.com.br/api/estoque"
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div>
          <label htmlFor="webhookMethod" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Método HTTP:</label>
          <select
            id="webhookMethod"
            value={webhookMethod}
            onChange={(e) => setWebhookMethod(e.target.value as 'POST' | 'PUT')}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
          </select>
        </div>

        <div>
          <label htmlFor="webhookFormat" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Formato do Payload:</label>
          <select
            id="webhookFormat"
            value={webhookFormat}
            onChange={(e) => setWebhookFormat(e.target.value as 'JSON' | 'FORM_DATA')}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="JSON">JSON</option>
            <option value="FORM_DATA">FORM_DATA (url-encoded)</option>
          </select>
        </div>

        <div style={{  marginRight: '22px' }}>
          <label htmlFor="apiToken" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Token de Autenticação (Opcional):</label>
          <input
            type="text"
            id="apiToken"
            value={apiToken}
            onChange={(e) => setApiToken(e.target.value)}
            placeholder="Token para seu sistema (se necessário)"
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div>
          <label htmlFor="plan" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Plano:</label>
          <select
            id="plan"
            value={plan}
            onChange={(e) => setPlan(e.target.value as 'free' | 'basic' | 'premium')}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '12px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            fontSize: '16px', 
            fontWeight: 'bold',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </form>
    </div>
  );
}