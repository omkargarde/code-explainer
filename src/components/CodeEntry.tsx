import CodeForm from "./CodeForm";
import Navbar from "./Navbar";

export default function CodeEntry() {
  return (
    <section className="flex min-h-screen flex-col items-center p-6">
      <Navbar />
      <CodeForm />
    </section>
  );
}
