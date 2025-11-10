
import React, { useState, useCallback, useRef } from 'react';
import { generateResponse } from './services/geminiService';
import { SendIcon, ImageIcon, CloseIcon } from './components/icons';
import { LoadingSpinner } from './components/LoadingSpinner';
import { GeminiLogo } from './components/GeminiLogo';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [image, setImage] = useState<{ file: File; base64: string } | null>(null);
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (error) => reject(error);
    });

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError('A imagem é muito grande. Por favor, escolha um arquivo menor que 2MB.');
        return;
      }
      setError(null);
      try {
        const base64 = await fileToBase64(file);
        setImage({ file, base64 });
      } catch (err) {
        setError('Falha ao carregar a imagem.');
        console.error(err);
      }
    }
  };
  
  const handleRemoveImage = () => {
    setImage(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if ((!prompt.trim() && !image) || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      const imagePart = image ? { base64: image.base64, mimeType: image.file.type } : null;
      const result = await generateResponse(prompt, imagePart);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
      handleRemoveImage();
    }
  }, [prompt, image, isLoading]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 font-sans">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
      <div className="w-full max-w-3xl flex flex-col h-full">
        <header className="text-center mb-8 flex flex-col items-center">
          <GeminiLogo className="w-16 h-16 mb-4" />
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Gerador de Respostas IA
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Faça qualquer pergunta, envie uma foto e obtenha uma resposta inteligente da IA.
          </p>
        </header>

        <main className="flex-grow flex flex-col">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Digite sua pergunta ou descreva a imagem..."
                className="w-full h-28 p-4 pr-28 text-lg bg-gray-800 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-colors duration-300 resize-none text-gray-100 placeholder-gray-500"
                disabled={isLoading}
              />
              <div className="absolute bottom-3.5 right-4 flex items-center space-x-2">
                 <button 
                   type="button" 
                   onClick={() => fileInputRef.current?.click()}
                   disabled={isLoading}
                   className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 disabled:text-gray-600 disabled:bg-transparent disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-all duration-300"
                   aria-label="Anexar imagem"
                 >
                    <ImageIcon className="w-6 h-6" />
                 </button>
                 <button
                   type="submit"
                   disabled={isLoading || (!prompt.trim() && !image)}
                   className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-all duration-300 transform active:scale-95"
                   aria-label="Enviar"
                 >
                   <SendIcon className="w-6 h-6 text-white" />
                 </button>
              </div>
            </div>

            {image && (
              <div className="mt-4 relative w-40 animate-fade-in">
                  <img src={`data:${image.file.type};base64,${image.base64}`} alt="Preview da imagem selecionada" className="rounded-lg w-full h-auto" />
                  <button 
                    onClick={handleRemoveImage} 
                    className="absolute -top-2 -right-2 p-1 bg-gray-700 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 transition-all"
                    aria-label="Remover imagem"
                  >
                      <CloseIcon className="w-5 h-5" />
                  </button>
              </div>
            )}
          </form>

          <div className="mt-8 flex-grow w-full">
            {isLoading && (
              <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-xl border border-gray-700">
                <LoadingSpinner />
                <p className="mt-4 text-gray-400">Gerando resposta...</p>
              </div>
            )}
            {error && (
              <div className="p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-xl">
                <h3 className="font-bold">Erro</h3>
                <p>{error}</p>
              </div>
            )}
            {response && (
              <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg animate-fade-in">
                <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Resposta da IA</h2>
                <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap text-lg leading-relaxed">
                  {response}
                </div>
              </div>
            )}
          </div>
        </main>

        <footer className="text-center text-gray-500 mt-8 py-4">
          <p>Powered by Google Gemini API</p>
        </footer>
      </div>
      <style>{`
        .prose a { color: #818cf8; }
        .prose strong { color: #fafafa; }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;
