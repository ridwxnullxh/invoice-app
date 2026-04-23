export default function StatusBadge({ status = "draft" }) {
  const config = {
    paid: {
      bg: "bg-teal-100 dark:bg-teal-900/30",
      text: "text-teal-600 dark:text-teal-300",
      dot: "bg-teal-500",
    },
    pending: {
      bg: "bg-orange-100 dark:bg-orange-900/30",
      text: "text-orange-600 dark:text-orange-300",
      dot: "bg-orange-500",
    },
    draft: {
      bg: "bg-gray-100 dark:bg-gray-700",
      text: "text-gray-600 dark:text-gray-300",
      dot: "bg-gray-400",
    },
  };
  const s = config[status] || config.draft;
  const labels = { paid: "Paid", pending: "Pending", draft: "Draft" };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${s.bg} ${s.text}`}
    >
      <span className={`w-2 h-2 rounded-full ${s.dot}`}></span>
      {labels[status]}
    </div>
  );
}
