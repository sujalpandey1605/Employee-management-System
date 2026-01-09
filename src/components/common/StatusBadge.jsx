function StatusBadge({ status }) {
  const map = {
    "Completed": "success",
    "In Progress": "warning",
    "Pending": "secondary",
    "Overdue": "danger",
  };

  return (
    <span className={`badge bg-${map[status] || "secondary"}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
