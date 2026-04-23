// components/StatusBadge.jsx

const statusConfig = {
  paid: {
    dot: 'bg-status-paid',
    text: 'text-status-paid',
    bg: 'bg-status-paid-bg dark:bg-[rgba(51,214,159,0.06)]',
    label: 'Paid',
  },
  pending: {
    dot: 'bg-status-pending',
    text: 'text-status-pending',
    bg: 'bg-status-pending-bg dark:bg-[rgba(255,143,0,0.06)]',
    label: 'Pending',
  },
  draft: {
    dot: 'bg-text-body dark:bg-[#DFE3FA]',
    text: 'text-text-body dark:text-[#DFE3FA]',
    bg: 'bg-[rgba(55,59,83,0.06)] dark:bg-[rgba(223,227,250,0.06)]',
    label: 'Draft',
  },
};

export default function StatusBadge({ status }) {
  const cfg = statusConfig[status?.toLowerCase()] || statusConfig.draft;
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-spartan font-bold text-[12px] ${cfg.bg} ${cfg.text}`}>
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
