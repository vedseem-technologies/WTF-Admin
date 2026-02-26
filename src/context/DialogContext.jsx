import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { AlertTriangle, CheckCircle, Info, Trash2 } from "lucide-react";

const DialogContext = createContext(null);

const VARIANTS = {
  danger: {
    Icon: Trash2,
    accent: "#DC2626",
    accentLight: "#FEE2E2",
    gradient: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
    shadow: "0 8px 24px -4px rgba(220,38,38,0.35)",
  },
  warning: {
    Icon: AlertTriangle,
    accent: "#F59E0B",
    accentLight: "#FEF3C7",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    shadow: "0 8px 24px -4px rgba(245,158,11,0.35)",
  },
  success: {
    Icon: CheckCircle,
    accent: "#4ECB71",
    accentLight: "#E8F8ED",
    gradient: "linear-gradient(135deg, #4ECB71 0%, #22C55E 100%)",
    shadow: "0 8px 24px -4px rgba(78,203,113,0.35)",
  },
  info: {
    Icon: Info,
    accent: "#5B9BD5",
    accentLight: "#E7F1FA",
    gradient: "linear-gradient(135deg, #5B9BD5 0%, #3B82F6 100%)",
    shadow: "0 8px 24px -4px rgba(91,155,213,0.35)",
  },
};

const DialogRenderer = ({ dialog, onResolve }) => {
  const [animState, setAnimState] = useState("closed");
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    if (dialog) {
      setAnimState("opening");
      const t = setTimeout(() => {
        setAnimState("open");
        confirmBtnRef.current?.focus();
      }, 20);
      return () => clearTimeout(t);
    }
  }, [dialog]);

  useEffect(() => {
    if (!dialog) return;
    const handler = (e) => {
      if (e.key === "Escape") onResolve(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [dialog, onResolve]);

  const handleClose = useCallback(
    (value) => {
      setAnimState("closing");
      setTimeout(() => {
        setAnimState("closed");
        onResolve(value);
      }, 180);
    },
    [onResolve],
  );

  if (!dialog && animState === "closed") return null;

  const {
    type,
    variant = "danger",
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
  } = dialog || {};

  const v = VARIANTS[variant] || VARIANTS.danger;
  const { Icon } = v;
  const isConfirm = type === "confirm";
  const show = animState === "opening" || animState === "open";

  return (
    <>
      <style>{`
        .wtf-dialog-backdrop {
          position: fixed; inset: 0; z-index: 2000;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .wtf-dialog-backdrop.show { opacity: 1; }

        .wtf-dialog-wrap {
          position: fixed; inset: 0; z-index: 2001;
          display: flex; align-items: center; justify-content: center;
          padding: 1.25rem;
          pointer-events: none;
        }

        .wtf-dialog-card {
          pointer-events: auto;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #fff;
          border-radius: 16px;
          width: 100%; max-width: 370px;
          overflow: hidden;
          box-shadow: 0 20px 50px -12px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.04);
          opacity: 0;
          transform: scale(0.92) translateY(12px);
          transition: all 0.22s cubic-bezier(0.34, 1.4, 0.64, 1);
        }
        .wtf-dialog-card.show {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        .wtf-dialog-body {
          padding: 32px 28px 24px;
          text-align: center;
        }

        .wtf-dialog-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center; justify-content: center;
          margin-bottom: 18px;
        }

        .wtf-dialog-title {
          margin: 0 0 8px;
          font-size: 17px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.3;
          letter-spacing: -0.02em;
        }

        .wtf-dialog-msg {
          margin: 0;
          font-size: 13.5px;
          color: #64748b;
          line-height: 1.55;
        }

        .wtf-dialog-actions {
          padding: 0 28px 24px;
          display: flex;
          gap: 10px;
        }

        .wtf-dialog-btn {
          flex: 1;
          padding: 11px 18px;
          font-size: 13.5px;
          font-weight: 600;
          font-family: inherit;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.15s ease;
          outline: none;
          line-height: 1;
        }

        .wtf-dialog-btn-cancel {
          border: 1.5px solid #E5E7EB;
          background: #fff;
          color: #4C566A;
        }
        .wtf-dialog-btn-cancel:hover {
          background: #F5F7FA;
          border-color: #D1D5DB;
        }
        .wtf-dialog-btn-cancel:active {
          transform: scale(0.97);
        }

        .wtf-dialog-btn-confirm {
          border: none;
          color: #fff;
          letter-spacing: 0.01em;
        }
        .wtf-dialog-btn-confirm:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }
        .wtf-dialog-btn-confirm:active {
          transform: translateY(0) scale(0.97);
        }
      `}</style>

      <div
        className={`wtf-dialog-backdrop${show ? " show" : ""}`}
        onClick={() => handleClose(false)}
      />

      <div className="wtf-dialog-wrap">
        <div
          className={`wtf-dialog-card${show ? " show" : ""}`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="wtf-dialog-title"
        >
          <div className="wtf-dialog-body">
            <div
              className="wtf-dialog-icon"
              style={{ background: v.accentLight }}
            >
              <Icon size={24} color={v.accent} strokeWidth={2} />
            </div>
            <h3 className="wtf-dialog-title" id="wtf-dialog-title">
              {title}
            </h3>
            {message && <p className="wtf-dialog-msg">{message}</p>}
          </div>

          <div className="wtf-dialog-actions">
            {isConfirm && (
              <button
                className="wtf-dialog-btn wtf-dialog-btn-cancel"
                onClick={() => handleClose(false)}
              >
                {cancelLabel}
              </button>
            )}
            <button
              ref={confirmBtnRef}
              className="wtf-dialog-btn wtf-dialog-btn-confirm"
              style={{ background: v.gradient, boxShadow: v.shadow }}
              onClick={() => handleClose(true)}
            >
              {type === "alert" ? "OK" : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export const DialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState(null);
  const [resolver, setResolver] = useState(null);

  const openDialog = useCallback((options) => {
    return new Promise((resolve) => {
      setDialog(options);
      setResolver(() => resolve);
    });
  }, []);

  const handleResolve = useCallback(
    (value) => {
      setDialog(null);
      setResolver(null);
      if (resolver) resolver(value);
    },
    [resolver],
  );

  const confirm = useCallback(
    (message, options = {}) =>
      openDialog({
        type: "confirm",
        message,
        title: options.title || "Confirm Action",
        ...options,
      }),
    [openDialog],
  );

  const alert = useCallback(
    (message, options = {}) =>
      openDialog({
        type: "alert",
        message,
        title: options.title || "Notice",
        ...options,
      }),
    [openDialog],
  );

  return (
    <DialogContext.Provider value={{ confirm, alert }}>
      {children}
      <DialogRenderer dialog={dialog} onResolve={handleResolve} />
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used within a DialogProvider");
  return ctx;
};

export default DialogContext;
