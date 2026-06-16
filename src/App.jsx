import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import Dock from "./components/Dock";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import About from "./components/About";
import Contact from "./components/Contact";

function App() {
  return (
    <div className="min-h-screen bg-bg text-white">
      <CustomCursor />
      <ScrollProgress />
      <Dock />

      <Hero />

      <Projects />

      <About />

      <Contact />
    </div>
  );
}

export default App;
