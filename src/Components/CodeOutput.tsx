import Output from "../types/Output";
import Loader from "./Loader";

function CodeOutput({ status, data }: { status: string; data: Output }) {
  let outputString = data ? atob(data?.stderr || data?.stdout || "") : "";

  if (status === "loading") return <Loader />;
  if (status === "error") return <div>error</div>;

  return (
    <div className="console-container" style={{ width: "80vh" }}>
      <p style={{ padding: "5px" }}>{outputString}</p>
    </div>
  );
}

export default CodeOutput;
