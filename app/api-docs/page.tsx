import { getApiDocs } from "@/lib/swagger";
import ReactSwagger from "./react-swagger";

export default async function ApiDocPage() {
  const spec = await getApiDocs();

  return (
    <main id="swagger-container">
      <ReactSwagger spec={spec} />
    </main>
  );
}