function Pagination({ page, totalPages, onChange }) {
  return (
    <nav>
      <ul className="pagination">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onChange(page - 1)}>
            Prev
          </button>
        </li>

        <li className="page-item disabled">
          <span className="page-link">
            Page {page} of {totalPages}
          </span>
        </li>

        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onChange(page + 1)}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
