export default function LoadingState() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
    }}>
      {/* Hourglass icon */}
      <div style={{ marginBottom: '12px', fontSize: '32px' }}>⌛</div>

      <div style={{ 
        fontSize: '13px', 
        fontWeight: 'bold', 
        color: '#000000', 
        marginBottom: '8px',
        fontFamily: 'Tahoma, sans-serif'
      }}>
        Loading repository data...
      </div>
      <div style={{ 
        fontSize: '11px', 
        color: '#444444',
        fontFamily: 'Tahoma, sans-serif',
        marginBottom: '12px'
      }}>
        Please wait while we fetch the information
      </div>

      {/* Classic Windows 2000 progress bar */}
      <div style={{ width: '240px' }}>
        <div className="win-progress">
          <div className="win-progress-fill" style={{ width: '70%' }} />
        </div>
      </div>

      <div style={{ marginTop: '8px', fontSize: '11px', color: '#808080', fontFamily: 'Tahoma, sans-serif' }}>
        Connecting to repository server...
      </div>
    </div>
  )
}
