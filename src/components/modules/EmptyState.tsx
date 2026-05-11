import { Icon } from '../scenes/Icons';

interface EmptyStateProps {
  icon: string;
  message: string;
  delay?: string;
}

export function EmptyState({ icon, message, delay = "100ms" }: EmptyStateProps) {
  return (
    <div className="module p-4 module-enter" style={{ animationDelay: delay }}>
      <div className="flex flex-col items-center justify-center py-4 gap-2.5">
        <Icon name={icon} size={20} className="text-muted" />
        <div className="font-mono text-muted" style={{ fontSize: "11px" }}>{message}</div>
      </div>
    </div>
  );
}
