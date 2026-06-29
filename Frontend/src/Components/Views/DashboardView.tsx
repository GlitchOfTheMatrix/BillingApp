export default function DashboardView() {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Recent Orders</p>
      <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '20px'}}>
        <thead>
          <tr style={{background: '#e9ecef', textAlign: 'left'}}>
            <th style={{padding: '10px', borderBottom: '1px solid #ccc'}}>Order ID</th>
            <th style={{padding: '10px', borderBottom: '1px solid #ccc'}}>Date</th>
            <th style={{padding: '10px', borderBottom: '1px solid #ccc'}}>Amount</th>
            <th style={{padding: '10px', borderBottom: '1px solid #ccc'}}>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{padding: '10px', borderBottom: '1px solid #eee'}}>#1001</td>
            <td style={{padding: '10px', borderBottom: '1px solid #eee'}}>2026-06-20</td>
            <td style={{padding: '10px', borderBottom: '1px solid #eee'}}>$1,500.00</td>
            <td style={{padding: '10px', borderBottom: '1px solid #eee', color: 'green'}}>Completed</td>
          </tr>
          <tr>
            <td style={{padding: '10px', borderBottom: '1px solid #eee'}}>#1002</td>
            <td style={{padding: '10px', borderBottom: '1px solid #eee'}}>2026-06-22</td>
            <td style={{padding: '10px', borderBottom: '1px solid #eee'}}>$350.00</td>
            <td style={{padding: '10px', borderBottom: '1px solid #eee', color: 'orange'}}>Pending</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
