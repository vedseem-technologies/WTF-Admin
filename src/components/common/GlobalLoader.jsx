import LoadingBar from 'react-top-loading-bar';
import { useData } from '../../context/DataContext';

const GlobalLoader = () => {
  const { progress, setProgress } = useData();
  return (
    <LoadingBar
      color="#FF4B2B"
      progress={progress}
      onLoaderFinished={() => setProgress(0)}
      height={3}
    />
  );
};

export default GlobalLoader;
