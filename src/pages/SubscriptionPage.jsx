// kevyamon/yely_frontend/src/pages/SubscriptionPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Check, Smartphone, Calendar, Crown, ArrowRight, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import AppToast from '../components/ui/AppToast';
import { submitSubscriptionProof, resetSubscriptionState } from '../features/subscription/subscriptionSlice';

// Récupération des configurations depuis le fichier .env
const WAVE_LINK_WEEKLY = import.meta.env.VITE_WAVE_LINK_WEEKLY || "https://wave.com/business/weekly-link";
const WAVE_LINK_MONTHLY = import.meta.env.VITE_WAVE_LINK_MONTHLY || "https://wave.com/business/monthly-link";
const IS_PROMO = import.meta.env.VITE_IS_PROMO_ACTIVE === 'true'; // Convertit la string "true" en booléen

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [step, setStep] = useState('SELECTION');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const dispatch = useDispatch();

  // On écoute l'état de l'envoi dans Redux
  const { isLoading, isSuccess, error } = useSelector((state) => state.subscription);

  // Effet pour gérer le succès ou l'erreur après la soumission
  useEffect(() => {
    if (isSuccess) {
      setToast({ show: true, message: 'Preuve reçue ! Activation sous 15 min.', type: 'success' });
      // Reset complet après 2 secondes
      const timer = setTimeout(() => {
        resetForm();
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (error) {
      setToast({ show: true, message: error, type: 'error' });
      dispatch(resetSubscriptionState()); // On reset l'erreur pour permettre de réessayer
    }
  }, [isSuccess, error, dispatch]);

  const resetForm = () => {
    setStep('SELECTION');
    setSelectedPlan(null);
    setProofFile(null);
    setPreviewUrl(null);
    setPaymentPhone('');
    dispatch(resetSubscriptionState());
  };

  const handlePlanSelect = (planType) => {
    setSelectedPlan(planType);
    
    // Si c'est en promo, on pourrait avoir des liens différents, 
    // ici on garde la logique simple pour l'instant
    const link = planType === 'WEEKLY' ? WAVE_LINK_WEEKLY : WAVE_LINK_MONTHLY;
    
    // Ouvrir Wave
    window.open(link, '_blank');
    
    // Passer à l'étape de preuve
    setStep('CONFIRMATION');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        // Vérification taille (ex: max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setToast({ show: true, message: 'L\'image est trop lourde (Max 5Mo)', type: 'error' });
            return;
        }
        setProofFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    
    if (!paymentPhone || !proofFile) {
      setToast({ show: true, message: 'Numéro et capture d\'écran obligatoires', type: 'error' });
      return;
    }

    // Préparation du paquet pour le facteur
    const formData = new FormData();
    formData.append('type', selectedPlan);
    formData.append('paymentPhoneNumber', paymentPhone);
    formData.append('proofImage', proofFile); // C'est ici que l'image est attachée

    // Envoi via Redux
    dispatch(submitSubscriptionProof(formData));
  };

  // --- COMPOSANTS VISUELS (UI) ---
  
  const PlanCard = ({ title, price, promoPrice, features, type, color, icon: Icon }) => (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handlePlanSelect(type)}
      className={`relative overflow-hidden cursor-pointer rounded-2xl border border-white/10 backdrop-blur-md p-6 flex flex-col items-center text-center transition-all duration-300 ${
        type === 'MONTHLY' ? 'bg-gradient-to-b from-[#FFD700]/10 to-transparent' : 'bg-white/5'
      }`}
    >
        {IS_PROMO && (
            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                PROMO
            </div>
        )}

        <div className={`p-4 rounded-full mb-4 ${color}`}>
            <Icon size={32} className="text-white" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        
        <div className="flex items-baseline gap-2 mb-6">
            {IS_PROMO ? (
                <>
                    <span className="text-3xl font-bold text-[#FFD700]">{promoPrice}F</span>
                    <span className="text-sm text-gray-400 line-through">{price}F</span>
                </>
            ) : (
                <span className="text-3xl font-bold text-[#FFD700]">{price}F</span>
            )}
        </div>

        <ul className="space-y-3 mb-6 w-full text-left">
            {features.map((feat, index) => (
                <li key={index} className="flex items-center text-gray-300 text-sm">
                    <Check size={16} className="text-[#FFD700] mr-2 flex-shrink-0" />
                    {feat}
                </li>
            ))}
        </ul>

        <button className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            Choisir ce pack <ArrowRight size={18} />
        </button>
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 bg-[#121212]">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Abonnement Chauffeur</h1>
            <p className="text-gray-400">Accédez à toutes les courses sans commission.</p>
        </div>

        <AnimatePresence mode="wait">
            {step === 'SELECTION' ? (
                <motion.div 
                    key="selection"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="grid md:grid-cols-2 gap-6"
                >
                    <PlanCard 
                        title="Pack Hebdomadaire" 
                        price="1200" 
                        promoPrice="1000"
                        type="WEEKLY"
                        color="bg-blue-500/20"
                        icon={Calendar}
                        features={[
                            "Accès complet 7 jours",
                            "100% des gains pour vous",
                            "Support prioritaire"
                        ]}
                    />

                    <PlanCard 
                        title="Pack Mensuel" 
                        price="6000" 
                        promoPrice="5000"
                        type="MONTHLY"
                        color="bg-[#FFD700]/20"
                        icon={Crown}
                        features={[
                            "Accès complet 30 jours",
                            "Badge 'Chauffeur Vérifié'",
                            "Plus économique",
                            "Accès aux courses VIP"
                        ]}
                    />
                </motion.div>
            ) : (
                <motion.div 
                    key="confirmation"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="max-w-md mx-auto"
                >
                    <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-white/10 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Validation</h2>
                            <button onClick={() => setStep('SELECTION')} className="p-2 hover:bg-white/10 rounded-full text-gray-400">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                            <p className="text-blue-200 text-sm flex gap-2">
                                <Smartphone size={40} className="flex-shrink-0" />
                                <span>Après votre paiement Wave, envoyez la capture d'écran ici pour activer votre compte.</span>
                            </p>
                        </div>

                        <form onSubmit={handleSubmitProof} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Numéro de dépôt Wave</label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-3 text-gray-500" size={18} />
                                    <input 
                                        type="tel" 
                                        value={paymentPhone}
                                        onChange={(e) => setPaymentPhone(e.target.value)}
                                        className="w-full bg-[#121212] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#FFD700]"
                                        placeholder="ex: 07 07 07 07 07"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Preuve de paiement (Capture)</label>
                                <div 
                                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                                        previewUrl ? 'border-[#FFD700] bg-[#FFD700]/5' : 'border-gray-700 hover:border-gray-500'
                                    }`}
                                >
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    
                                    {previewUrl ? (
                                        <div className="relative">
                                            <img src={previewUrl} alt="Preuve" className="max-h-48 mx-auto rounded-lg shadow-lg" />
                                            <p className="mt-2 text-[#FFD700] text-sm font-medium">Changer l'image</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-500">
                                            <Upload size={32} className="mb-2" />
                                            <p className="text-sm">Cliquez ici pour ajouter l'image</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className={`w-full py-4 rounded-xl font-bold text-black text-lg shadow-lg transition-all ${
                                    isLoading 
                                    ? 'bg-gray-600 cursor-not-allowed' 
                                    : 'bg-[#FFD700] hover:bg-[#FFD700]/90 hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                            >
                                {isLoading ? 'Envoi en cours...' : 'CONFIRMER'}
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {toast.show && (
            <AppToast 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({ ...toast, show: false })} 
            />
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;