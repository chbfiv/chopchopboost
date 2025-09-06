import React, { useState, useCallback } from 'react';

interface GoalInputFormProps {
  onGeneratePlan: (prompt: string, imageFile: File | null) => void;
  isLoading: boolean;
  error: string | null;
}

const GoalInputForm: React.FC<GoalInputFormProps> = ({ onGeneratePlan, isLoading, error }) => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
    }
  };

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onGeneratePlan(prompt, imageFile);
  }, [onGeneratePlan, prompt, imageFile]);

  return (
  <div className="w-full max-w-sm aspect-[5/7] mx-auto animate-fade-in flex flex-col justify-center">
    <div className="bg-pk-yellow p-2 rounded-2xl shadow-2xl border-4 border-pk-blue flex-grow flex flex-col">
       <div className="bg-white rounded-lg overflow-hidden flex-grow flex flex-col">
                {/* Card Header */}
                <div className="h-40 bg-pk-blue flex items-center justify-center text-center text-white relative overflow-hidden">
                    <div className="absolute -bottom-10 -right-8 w-32 h-32 bg-white/20 rounded-full"></div>
                    <div className="absolute -top-4 -left-12 w-24 h-24 bg-white/20 rounded-full"></div>
                    <img 
                        src="/logo_with_background.png" 
                        alt="Chop Chop Boost Logo" 
                        className="w-full h-full object-cover z-10"
                    />
                </div>

                {/* Form Section */}
                <div className="p-6 bg-yellow-50">
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="goal-prompt" className="block text-md font-bold text-pk-blue mb-1">
                                Goal Name
                            </label>
                            <textarea
                                id="goal-prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder='e.g., "Bake Epic Cookies" or "Launch a Rocket"'
                                className="w-full h-24 p-3 text-slate-700 bg-white border-2 border-pk-blue/50 rounded-lg focus:ring-2 focus:ring-pk-yellow focus:border-pk-yellow transition duration-200 resize-none"
                                disabled={isLoading}
                            />
                        </div>

                         <div>
                            <label htmlFor="image-upload" className="block text-md font-bold text-pk-blue mb-1">
                                Add Theme Image (optional)
                            </label>
                            <div className="mt-1 flex items-center justify-center w-full">
                                <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-36 border-2 border-pk-blue/50 border-dashed rounded-lg cursor-pointer bg-white hover:bg-yellow-100 transition">
                                    {imagePreview ? (
                                        <div className="relative w-full h-full">
                                           <img src={imagePreview} alt="Image preview" className="object-contain w-full h-full rounded-lg p-1" />
                                           <button onClick={clearImage} type="button" className="absolute top-1 right-1 bg-pk-red text-white rounded-full p-1 hover:bg-pk-red/80 transition">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                           </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <svg className="w-8 h-8 mb-2 text-pk-blue/70" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                                            <p className="text-sm text-pk-blue/80"><span className="font-semibold">Click to upload</span></p>
                                        </div>
                                    )}
                                    <input id="image-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} disabled={isLoading} />
                                </label>
                            </div> 
                        </div>

                        {error && <p className="text-pk-red font-semibold text-sm text-center">{error}</p>}

                        <button
                          type="submit"
                          disabled={isLoading || !prompt.trim()}
                          className="w-full flex items-center justify-center text-pk-blue text-xl font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out bg-pk-yellow hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 border-2 border-pk-blue"
                        >
                          {isLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Creating Boosters...
                            </>
                          ) : (
                            'CREATE!'
                          )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
};

export default GoalInputForm;