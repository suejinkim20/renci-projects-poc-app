import DashboardView from "../components/views/DashboardView.jsx"

export default function DashboardPage() {

  return (
      <div style={{marginLeft: "1rem", marginRight: "1rem"}}>
        <div style={{marginBottom: "1.5rem"}}>
          <a href="/organization">
            <button 
              
              style={{backgroundColor: "#00758D80", padding: "0.5rem", borderRadius: "0.25rem"}}
            >View all RENCI projects</button>
          </a>
        </div>
        <DashboardView  />
      </div>
      
    )
}
