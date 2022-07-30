export const HorizontalFormRow: React.VFC<{
  label?: React.ReactNode;
  input?: React.ReactNode;
}> = ({ label, input }) => {
  return (
    <div className="row mb-3">
      <label className="col-sm-2">{label}</label>
      <div className="col-sm-10">{input}</div>
    </div>
  );
};
