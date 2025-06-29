import React, { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can also log the error to an error reporting service
        console.error("Error Boundary caught an error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md text-center">
                    <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong.</h2>
                    <p className="text-sm mb-4">We're sorry for the inconvenience. Please try refreshing the page.</p>
                    {this.state.error && <p className="text-xs italic">{this.state.error.toString()}</p>}
                    {this.state.errorInfo && (
                        <details className="mt-4 text-xs">
                            <summary>Details</summary>
                            <pre className="whitespace-pre-wrap break-all text-left mt-2 p-2 bg-red-50 rounded-md">
                                {this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;