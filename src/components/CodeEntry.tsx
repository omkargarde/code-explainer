import CodeForm from "./CodeForm";
import Header from "./Header";

export default function CodeEntry() {
  return (
    <section className="flex min-h-screen flex-col items-center p-6">
      <Header />
      <CodeForm />
    </section>
  );
}
