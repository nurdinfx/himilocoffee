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
    <div className="fixed bottom-0 right-0 m-6 z-[9999] pointer-events-none">
      {(offlineReady || needUpdate) && (
        <div className="bg-white/95 backdrop-blur-md border border-primary-100 rounded-3xl shadow-2xl p-5 min-w-[320px] pointer-events-auto animate-in slide-in-from-right-10 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${needUpdate ? 'bg-primary-500 animate-ping' : 'bg-green-500'}`} />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900">
                {offlineReady ? 'Ready for offline use' : 'Fresh contents available!'}
              </h4>
              <p className="text-[11px] text-gray-500 font-medium">
                {offlineReady 
                  ? 'Access Himilo Coffee even without internet' 
                  : 'Click update to get the latest menu and features'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {needUpdate && (
              <button
                onClick={() => updateServiceWorker(true)}
                className="flex-1 py-3 bg-primary-600 text-white text-xs font-extrabold rounded-2xl hover:bg-primary-700 transition-all active:scale-95 shadow-md shadow-primary-200"
              >
                UPDATE NOW
              </button>
            )}
            <button
              onClick={() => close()}
              className={`${needUpdate ? 'px-5' : 'w-full'} py-3 bg-gray-50 text-gray-500 text-xs font-bold rounded-2xl hover:bg-gray-100 transition-all active:scale-95 border border-gray-100`}
            >
              {needUpdate ? 'LATER' : 'AWESOME'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReloadPrompt;
