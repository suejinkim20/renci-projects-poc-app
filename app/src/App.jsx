import Router from "./router";
import NavBar from "./components/elements/NavBar";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6" 
      style={{
        width: "100vw",
        height: "100vh",
      }}>
      <NavBar />

      <main>
        <Router />
      </main>
    </div>
  );
}

export default App;
