import { useRegisterSW } from 'virtual:pwa-register/react';

const ReloadPrompt = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needUpdate: [needUpdate, setNeedUpdate],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedUpdate(false);
  };

  return (
    <div className="fixed bottom-0 right-0 m-4 z-[9999]">
      {(offlineReady || needUpdate) && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-4 min-w-[300px] animate-in slide-in-from-bottom flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${needUpdate ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
            <p className="text-sm font-semibold text-gray-800">
              {offlineReady ? 'App is ready to work offline' : 'New version available!'}
            </p>
          </div>
          
          <div className="flex gap-2 justify-end">
            {needUpdate && (
              <button
                onClick={() => updateServiceWorker(true)}
                className="px-4 py-2 bg-primary-600 text-white text-xs font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
              >
                Update Now
              </button>
            )}
            <button
              onClick={() => close()}
              className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReloadPrompt;
