// kevyamon/yely_frontend/src/pages/SubscriptionPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Smartphone, Calendar, Crown, Check, AlertCircle, Loader } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import AppToast from '../components/ui/AppToast';
import AppInput from '../components/ui/AppInput'; // Le composant maître
import { submitSubscriptionProof, resetSubscriptionState, checkSubscriptionStatus } from '../features/subscription/subscriptionSlice';

const WAVE_LINK_WEEKLY = import.meta.env.VITE_WAVE_LINK_WEEKLY || "https://wave.com/business/weekly-link";
const WAVE_LINK_MONTHLY = import.meta.env.VITE_WAVE_LINK_MONTHLY || "https://wave.com/business/monthly-link";
const IS_PROMO = import.meta.env.VITE_IS_PROMO_ACTIVE === 'true';

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [step, setStep] = useState('SELECTION');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const dispatch = useDispatch();
  const { isLoading, isSuccess, error, currentSubscription, lastTransaction } = useSelector((state) => state.subscription);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => { dispatch(checkSubscriptionStatus()); }, [dispatch]);

  useEffect(() => {
    if (isSuccess) setToast({ show: true, message: 'Preuve reçue.', type: 'success' });
    if (error) {
      setToast({ show: true, message: error, type: 'error' });
      setTimeout(() => dispatch(resetSubscriptionState()), 3000);
    }
  }, [isSuccess, error, dispatch]);

  const handlePlanSelect = (planType) => {
    setSelectedPlan(planType);
    window.open(planType === 'WEEKLY' ? WAVE_LINK_WEEKLY : WAVE_LINK_MONTHLY, '_blank');
    setStep('CONFIRMATION');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setProofFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmitProof = (e) => {
    e.preventDefault();
    if (!paymentPhone || !proofFile) return setToast({ show: true, message: 'Champs manquants', type: 'error' });
    const formData = new FormData();
    formData.append('type', selectedPlan);
    formData.append('paymentPhoneNumber', paymentPhone);
    formData.append('proofImage', proofFile);
    dispatch(submitSubscriptionProof(formData));
  };

  // --- COMPOSANT CARTE (DESIGN INDUSTRIEL) ---
  const PlanCard = ({ title, price, features, type, icon: Icon }) => (
    <div 
      onClick={() => handlePlanSelect(type)}
      className="bg-[#1E1E1E] rounded-xl border-2 border-white/10 hover:border-[#FFD700] transition-colors cursor-pointer p-6 flex flex-col h-full group"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#121212] rounded-lg border border-white/10 group-hover:border-[#FFD700] transition-colors">
                <Icon size={24} className="text-[#FFD700]" />
            </div>
            {IS_PROMO && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">PROMO</span>}
        </div>
        
        <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
        <p className="text-[#FFD700] text-3xl font-bold mb-6">{price}F</p>
        
        <div className="flex-grow space-y-3 mb-6">
            {features.map((f, i) => (
                <div key={i} className="flex items-start text-sm text-gray-400">
                    <Check size={16} className="text-[#FFD700] mr-2 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                </div>
            ))}
        </div>

        <button className="w-full py-3 bg-[#121212] border-2 border-white/20 text-white font-bold rounded-lg group-hover:bg-[#FFD700] group-hover:text-black group-hover:border-[#FFD700] transition-all">
            SÉLECTIONNER
        </button>
    </div>
  );

  // --- VUE : ABONNEMENT ACTIF ---
  const ActiveView = () => (
    <div className="bg-[#1E1E1E] border-2 border-[#FFD700] rounded-xl p-8 text-center max-w-md mx-auto">
        <div className="inline-block p-4 bg-[#FFD700]/10 rounded-full mb-4 text-[#FFD700]">
            <Crown size={48} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Compte Chauffeur Actif</h2>
        <div className="text-gray-400 mb-6">
            Votre abonnement <span className="text-[#FFD700]">{currentSubscription?.plan === 'WEEKLY' ? 'Hebdo' : 'Mensuel'}</span> est valide jusqu'au :
            <div className="text-white text-xl font-mono mt-1">
                {currentSubscription?.endDate ? new Date(currentSubscription.endDate).toLocaleDateString() : 'N/A'}
            </div>
        </div>
    </div>
  );

  // --- VUE : EN ATTENTE ---
  const PendingView = () => (
    <div className="bg-[#1E1E1E] border-2 border-blue-500 rounded-xl p-8 text-center max-w-md mx-auto">
        <div className="inline-block p-4 bg-blue-500/10 rounded-full mb-4 text-blue-500 animate-pulse">
            <Loader size={48} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Vérification en cours</h2>
        <p className="text-gray-400 mb-6">
            Votre preuve est reçue. Un administrateur va valider votre accès sous 10 minutes.
        </p>
        <button onClick={() => window.location.reload()} className="text-sm text-gray-500 hover:text-white underline">
            Rafraîchir le statut
        </button>
    </div>
  );

  // --- LOGIQUE D'AFFICHAGE ---
  let content;
  if (currentSubscription?.status === 'active') content = <ActiveView />;
  else if (isSuccess || lastTransaction?.status === 'PENDING') content = <PendingView />;
  else if (step === 'SELECTION') {
      content = (
        <div className="grid md:grid-cols-2 gap-4">
            <PlanCard 
                title="Pass Hebdo" 
                price={IS_PROMO ? "1000" : "1200"} 
                type="WEEKLY" 
                icon={Calendar}
                features={["Accès 7 Jours", "0% Commission", "Support 24/7"]} 
            />
            <PlanCard 
                title="Pass Mensuel" 
                price={IS_PROMO ? "5000" : "6000"} 
                type="MONTHLY" 
                icon={Crown}
                features={["Accès 30 Jours", "Badge 'Vérifié'", "Économie 16%"]} 
            />
        </div>
      );
  } else {
      // FORMULAIRE DE PREUVE
      content = (
        <div className="max-w-md mx-auto">
             <div className="bg-[#1E1E1E] rounded-xl border-2 border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Confirmer l'activation</h2>
                    <button onClick={() => setStep('SELECTION')} className="text-gray-400 hover:text-white">Annuler</button>
                </div>

                <div className="mb-6 p-4 bg-[#121212] border-l-4 border-blue-500 text-gray-300 text-sm">
                    Paiement Wave effectué ? Envoyez la capture d'écran ci-dessous.
                </div>

                <form onSubmit={handleSubmitProof} className="space-y-6">
                    <AppInput
                        label="Numéro du dépôt"
                        placeholder="07 07 07 07 07"
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        icon={Smartphone}
                        required
                    />

                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2 ml-1">Capture d'écran</label>
                        <div className={`relative h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${previewUrl ? 'border-[#FFD700] bg-[#121212]' : 'border-white/20 hover:border-white/40 bg-[#121212]'}`}>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preuve" className="h-full object-contain rounded" />
                            ) : (
                                <div className="text-gray-500 text-center">
                                    <Upload size={24} className="mx-auto mb-2" />
                                    <span className="text-sm">Appuyez pour ajouter</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <button disabled={isLoading} className={`w-full py-4 rounded-xl font-bold text-black text-lg shadow-lg transition-all ${isLoading ? 'bg-gray-600' : 'bg-[#FFD700] hover:bg-[#FFD700]/90'}`}>
                        {isLoading ? 'ENVOI...' : 'ENVOYER LA PREUVE'}
                    </button>
                </form>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#121212] px-4 pt-24 pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">ABONNEMENT</h1>
            <p className="text-gray-500 uppercase text-sm tracking-widest">Espace Chauffeur</p>
        </div>
        <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {content}
            </motion.div>
        </AnimatePresence>
        {toast.show && <AppToast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
      </div>
    </div>
  );
};

export default SubscriptionPage;