import Output from "../types/Output";
import Loader from "./Loader";

function CodeOutput({
  status,
  data,
  isFetching,
}: {
  status: string;
  data: Output;
  isFetching: boolean;
}) {
  let outputString = data ? atob(data?.stderr || data?.stdout || "") : "";
  console.log("refetch", isFetching, outputString);
  if (isFetching) return <Loader />;
  if (status === "error") return <div>error</div>;

  return (
    <div className="console-container">
      <p style={{ padding: "5px" }}>{outputString}</p>
    </div>
  );
}

export default CodeOutput;
