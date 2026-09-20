export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch (e) {
    return dateStr;
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Selected':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'Rejected':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    case 'Shortlisted':
    case 'Assessment':
    case 'Technical Interview':
    case 'HR Interview':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Under Review':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Applied':
    default:
      return 'bg-indigo-100 text-indigo-800 border-indigo-300';
  }
};
