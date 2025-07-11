import react from 'react';
import FileUpload from '../components/FileUpload';

function DashboardPage() {
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to your dashboard!</p>
            <FileUpload></FileUpload>
        </div>
    );
}
export default DashboardPage;