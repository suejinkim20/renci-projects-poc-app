import DashboardView from './components/views/DashboardView.jsx'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="bg-white shadow p-2 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">RENCI Projects Dashboard</h1>
      </header>
      <main>
        <DashboardView />
      </main>
    </div>
  )
}

export default App
