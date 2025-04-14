import Lottie from 'lottie-react';
import clearAnimation from '../lottie/clear.json';
import saveAnimation from '../lottie/save.json';

const animations = {
  clear: clearAnimation,
  save: saveAnimation,
};

export default function LottieEffect({ type }) {
  if (!type || !animations[type]) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <Lottie
        animationData={animations[type]}
        loop={false}
        className="w-60 h-60"
      />
    </div>
  );
}
