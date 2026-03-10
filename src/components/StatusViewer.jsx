import { useEffect, useState, useCallback, useMemo } from "react";
import { X, Loader2 } from "lucide-react";

export default function StatusViewer({ status, onClose, onNextUser }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const STORY_DURATION = 5000;

  const stories = status.stories || [];
  const currentStory = stories[currentIndex];

  // Memoize values to avoid unnecessary re-renders
  const currentStorytime = useMemo(() => {
    if (!currentStory?.createdAt) return "";
    return new Date(currentStory.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }, [currentStory]);

  // Reset when user changes or story changes
  useEffect(() => {
    setProgress(0);
    // Agar image hai toh loading true karo, warna false (text stories ke liye)
    setIsImageLoading(!!currentStory?.image);
  }, [currentIndex, status.id, currentStory?.image]);

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onNextUser();
    }
  }, [currentIndex, stories.length, onNextUser]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Progress Timer Logic
  useEffect(() => {
    // Jab tak loading ho rahi hai, timer mat chalao
    if (isImageLoading) return;

    const intervalTime = 50;
    const step = (intervalTime / STORY_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentIndex, isImageLoading, STORY_DURATION]);

  // Auto-next when progress reaches 100
  useEffect(() => {
    if (progress >= 100) {
      handleNext();
    }
  }, [progress, handleNext]);

  return (
    <div className="relative w-full max-w-[450px] h-full md:h-[95vh] bg-black md:rounded-2xl overflow-hidden flex flex-col shadow-2xl">
      
      {/* Progress Bars */}
      <div className="absolute top-4 left-0 w-full px-4 flex gap-1.5 z-50">
        {stories.map((_, i) => (
          <div key={i} className="h-[3px] flex-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-75 ease-linear"
              style={{
                width: i === currentIndex ? `${progress}%` : i < currentIndex ? "100%" : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-8 left-0 w-full px-4 flex items-center justify-between z-50 text-white bg-gradient-to-b from-black/60 to-transparent pb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-white/40 overflow-hidden bg-gray-600 flex-shrink-0">
            {status.profilePic ? (
              <img src={status.profilePic} className="w-full h-full object-cover" alt="" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">
                {status.name?.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-sm">{status.name}</p>
            <p className="text-[10px] opacity-80 uppercase">{currentStorytime}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Navigation Click Areas */}
      <div className="absolute inset-0 flex z-40">
        <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev}></div>
        <div className="w-2/3 h-full cursor-pointer" onClick={handleNext}></div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-zinc-900 flex items-center justify-center relative">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Loader2 className="text-white animate-spin w-10 h-10 opacity-50" />
          </div>
        )}

        {currentStory?.image ? (
          <img
            key={currentStory.image} // Key change triggers reload/animation
            src={currentStory.image}
            onLoad={() => setIsImageLoading(false)}
            className={`w-full h-full object-contain transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
            alt="story"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-10 bg-gradient-to-br from-purple-600 to-blue-700 text-white text-center">
            <h2 className="text-2xl font-medium leading-relaxed">
              {currentStory?.text}
            </h2>
          </div>
        )}

        {/* Caption Overlay (only if image exists) */}
        {!isImageLoading && currentStory?.text && currentStory?.image && (
          <div className="absolute bottom-10 left-0 w-full px-6 py-4 bg-black/40 backdrop-blur-md text-white text-center z-50">
            <p className="text-sm">{currentStory.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}