import CodeForm from "./CodeForm";
import Header from "./Header";

export default function CodeEntry() {
	return (
		<section className="min-h-screen flex flex-col items-center p-6">
			<Header />
			<CodeForm />
		</section>
	);
}
