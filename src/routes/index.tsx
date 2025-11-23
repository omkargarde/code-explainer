import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero min-h-[70vh] bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Master Your Technical Interviews</h1>
            <p className="py-6">
              Upload your study notes, generate tailored questions, and get
              AI-powered feedback on your answers. Level up your prep today.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/upload" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/generate/questions" className="btn btn-outline">
                Practice Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title">1. Upload Notes</h2>
              <p>
                Bring your own study materials. We support Markdown files to
                create a personalized knowledge base.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title">2. Generate Questions</h2>
              <p>
                Our AI analyzes your notes to create relevant, challenging
                interview questions tailored to your content.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title">3. Get Feedback</h2>
              <p>
                Record your answers via audio. Receive instant, constructive
                feedback to improve your delivery and content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
