import Router from "./router";
import NavBar from "./components/elements/NavBar";
import Footer from "./components/elements/Footer";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6" 
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}>
      <NavBar />

      <main>
        <Router />
      </main>
      <Footer />

    </div>
  );
}

export default App;
