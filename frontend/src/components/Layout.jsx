import Sidebar from './Sidebar';

const Layout = ({ children }) => (
  <div className="flex min-h-screen">
    <Sidebar />
    <main className="flex-1 p-8 overflow-y-auto bg-surface">
      {children}
    </main>
  </div>
);

export default Layout;
