import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('Apple Eats Frontend Error Caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.removeItem('ae_cart_v1');
    } catch (e) {
      // ignore
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center p-4 sm:p-6 text-neutral-900">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-modal border border-neutral-200/80 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-50 border border-brand-200 text-brand-700 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
              Oops! Something went wrong
            </h1>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
              We encountered an unexpected display issue while preparing your order. Your cart and details are safely cached.
            </p>

            {this.state.error && (
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-left text-[11px] font-mono text-neutral-700 max-h-28 overflow-y-auto">
                {this.state.error.toString()}
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-brand-700 hover:bg-brand-800 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
            </div>

            <div className="pt-2 text-[11px] text-neutral-400">
              Apple Eats Stoke-on-Trent Dispatch Support: 01782 698710
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
