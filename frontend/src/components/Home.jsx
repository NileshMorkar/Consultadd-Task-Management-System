import Button from "./Button";

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center from-slate-900 via-gray-800 to-slate-900 text-white px-4">
      <div className="w-full max-w-3xl text-center bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-gray-700">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-cyan-400 drop-shadow">
          My Task Manager
        </h1>
        <p className="text-lg md:text-xl leading-relaxed mb-8 text-gray-100">
          Welcome to your <strong className="text-white">Smart Task Manager</strong>.<br />
          Take control of your work and time with a simple, powerful task management system.<br />
          Create, organize, and track tasks effortlessly — whether you're managing personal goals, team projects, or daily to-dos.<br />
          <span className="text-3xl">🚀</span> Plan smarter, collaborate better, and stay focused on what matters most.
        </p>
        <Button
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 text-lg rounded-full shadow-lg transition-all duration-300"
          text="Go to Dashboard"
          url="/dashboard"
        />
      </div>
    </div>
  );
}

export default Home;
