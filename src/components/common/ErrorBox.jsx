function ErrorBox({ message }) {
  return (
    <div className="alert alert-danger">
      {message}
    </div>
  );
}

export default ErrorBox;
