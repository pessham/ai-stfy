import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QuizPage } from './components/QuizPage';
import { ResultPage } from './components/ResultPage';
import ninjaGirls from '../public/ninja-girls.jpg';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">エラーが発生しました</h1>
          <p className="text-gray-600 mb-4">{this.state.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            再読み込み
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
          <header className="max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
            <h1 className="text-5xl font-bold text-blue-900 mb-4 tracking-tight">AIストファイ</h1>
            <p className="text-xl text-blue-600 font-medium mb-8">AI時代の新しいあなたの強み分析</p>
            <img src={ninjaGirls} alt="Ninja Girls" className="w-80 mx-auto mb-8 rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-300" />
            <div className="w-32 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </header>
          <main className="max-w-4xl mx-auto px-4 pb-16">
            <Routes>
              <Route path="/" element={<QuizPage />} />
              <Route path="/result" element={<ResultPage />} />
            </Routes>
          </main>
          <footer className="bg-white py-8 border-t border-blue-100">
            <div className="max-w-4xl mx-auto px-4 text-center text-blue-500">
              <p>&copy; 2025 AIストファイ - あなたの強みを発見</p>
            </div>
          </footer>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
