import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";


export default function Homepage() {
  const navigate = useNavigate();

  const goLogin = () => {
    navigate('/login');
  };

  const goProfile = () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-wide">AI Code Analyzer</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="rounded-2xl"
              onClick={goProfile}
            >
                Profile
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black rounded-2xl"
              onClick={goLogin}
            >
                Login
            </Button>
            <Button
              variant="primary"
              className="text-black bg-white hover:bg-gray-200 rounded-2xl"
              onClick={() => navigate('/register')}
            >
                Register
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Analyze Your Code <br />
            <span className="text-gray-400">Smarter. Faster. Better.</span>
          </h2>

          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
            AI Code Analyzer helps you detect bugs, improve performance,
            and maintain clean, efficient code using advanced AI-powered
            insights.
          </p>

          <div className="mt-10 flex justify-center gap-6">
            <Button className="bg-white text-black hover:bg-gray-200 rounded-2xl px-8 py-6 text-lg">
              Get Started
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black rounded-2xl px-8 py-6 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>© {new Date().getFullYear()} AI Code Analyzer. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
