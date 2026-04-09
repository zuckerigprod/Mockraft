import { useEffect } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors: Record<ToastType, string> = {
  success: "border-green-500 text-green-400",
  error: "border-red-500 text-red-400",
  info: "border-blue-500 text-blue-400",
  warning: "border-yellow-500 text-yellow-400",
};

export function Toast({ message, type = "info", onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const Icon = icons[type];

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-surface-900 border-l-4
      ${colors[type]} rounded-lg px-4 py-3 shadow-xl animate-in slide-in-from-right`}>
      <Icon size={18} />
      <span className="text-sm text-surface-200">{message}</span>
    </div>
  );
}
