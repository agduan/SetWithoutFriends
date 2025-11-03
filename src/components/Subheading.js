function Subheading({ children, ...props }) {
  return (
    <div
      style={{
        textAlign: "center",
        fontSize: "0.95rem",
        fontWeight: "lighter",
        marginBottom: "0.25rem",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export default Subheading;
