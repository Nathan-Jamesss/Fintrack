import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public props: Props;
  public state: State = {
    hasError: false,
    error: null,
  };

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    const { hasError, error } = this.state;
    if (hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-rose-100 shadow-xl shadow-rose-500/5">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                We encountered an unexpected error. This might be due to a connection issue or a temporary problem with our servers.
              </p>
              
              {error && (
                <div className="bg-slate-50 p-4 rounded-xl mb-8 text-left overflow-auto max-h-40">
                  <p className="text-xs font-mono text-slate-500 break-all">
                    {error.message}
                  </p>
                </div>
              )}

              <Button 
                className="w-full gap-2" 
                onClick={() => window.location.reload()}
              >
                <RefreshCcw size={20} />
                Reload Application
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
