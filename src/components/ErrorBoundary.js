import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error to a service here
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong.</h1>
          <p className="mb-4">An unexpected error occurred. Please try reloading the page.</p>
          <button className="btn-primary" onClick={this.handleReload}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 