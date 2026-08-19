export default function PrintButton(): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="marketing-button-primary print:hidden"
    >
      Download PDF
    </button>
  );
}
