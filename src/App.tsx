import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom'; // Switch, Route を追加
// import { StrengthAssessment } from './components/StrengthAssessment'; // StrengthAssessment は一旦コメントアウト
import { QuizPage } from './components/QuizPage'; // QuizPage をインポート
import { ResultPage } from './components/ResultPage'; // ResultPage をインポート

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
            <div className="w-32 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </header>
          <main className="max-w-4xl mx-auto px-4 pb-16">
            <Switch>
              <Route path="/" exact>
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-8 text-blue-800">AI時代のあなたの強みを診断しましょう</h2>
                  <p className="text-lg mb-8 text-gray-700">
                    AIストファイは、AI時代におけるあなたの強みを分析し、キャリア形成のヒントを提供します。
                    10の質問に答えるだけで、あなたの強みタイプが明らかになります。
                  </p>
                  <button
                    onClick={() => window.location.hash = '/quiz'}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg transition-all transform hover:scale-105"
                  >
                    診断を始める
                  </button>
                </div>
              </Route>
              <Route path="/quiz" component={QuizPage} />
              <Route path="/result" component={ResultPage} />
            </Switch>
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
