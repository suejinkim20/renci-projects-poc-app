import OrgSummaryView from "../components/views/OrgSummaryView.jsx"

export default function OrgSummaryPage() {

  return (
    <div style={{marginLeft: "1rem", marginRight: "1rem"}}>
      <h2>RENCI-wide Projects View</h2>
      <div style={{marginBottom: "1.5rem"}}>
        <button 
          href="/dashboard"
          style={{backgroundColor: "#00758D80", padding: "0.5rem", borderRadius: "0.25rem"}}
        >View projects by research group</button>
      </div>
      <OrgSummaryView  />
    </div>
    
  )
}
