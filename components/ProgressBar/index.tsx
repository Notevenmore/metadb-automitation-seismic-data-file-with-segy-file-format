import {useNProgress} from '@tanem/react-nprogress';

const ProgressBar: React.FC<{isRouteChanging: boolean}> = ({
  isRouteChanging,
}) => {
  const {animationDuration, isFinished, progress} = useNProgress({
    isAnimating: isRouteChanging,
  });

  return (
    <>
      <style jsx>{`
        .container {
          opacity: ${isFinished ? 0 : 1};
          pointer-events: none;
          transition: opacity ${animationDuration}ms linear;
        }

        .bar {
          background: #29d;
          height: 6px;
          left: 0;
          margin-left: ${(-1 + progress) * 100}%;
          position: fixed;
          top: 0;
          transition: margin-left ${animationDuration}ms linear;
          width: 100%;
          z-index: 1031;
        }

        @keyframes spinner {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .spinner {
          animation: spinner 400ms linear infinite;
          border-bottom: 3px solid transparent;
          border-left: 3px solid #29d;
          border-radius: 50%;
          border-right: 3px solid transparent;
          border-top: 3px solid #29d;
          box-sizing: border-box;
          height: 30px;
          width: 30px;
        }
      `}</style>
      <div className="container">
        <div className="bar" />
        <div className="block fixed right-6 top-80p z-50">
          <div className="spinner" />
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
