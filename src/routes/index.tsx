import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="bg-base-200 min-h-screen">
      {/* Hero Section */}
      <div className="hero bg-base-100 min-h-[70vh]">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold text-balance">
              Master Your Technical Interviews
            </h1>
            <p className="py-6 text-pretty">
              Upload your study notes, generate tailored questions, and get
              AI-powered feedback on your answers. Level up your prep today.
            </p>
            <div className="flex justify-center gap-4">
              {/* TODO: make actual get Started page*/}
              {/* <Link to="/upload" className="btn btn-primary">
                Get Started
              </Link>*/}
              <Link to="/chat" className="btn btn-block btn-primary py-6">
                Practice Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
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
