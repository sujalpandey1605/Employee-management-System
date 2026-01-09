function Toast({ type = "success", message, onClose }) {
  return (
    <div
      className={`alert alert-${type} position-fixed top-0 end-0 m-3`}
      style={{ zIndex: 1050 }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <span>{message}</span>
        <button className="btn-close" onClick={onClose}></button>
      </div>
    </div>
  );
}

export default Toast;
