import Router from "./router"

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="bg-white shadow p-2 mb-6">
        {/* nav links */}
        <div style={{margin: "1rem"}}>
          <h2>RENCI Projects Matrix</h2>
        </div>

      </header>

      <main>
        <Router />
      </main>
    </div>
  )
}

export default App
