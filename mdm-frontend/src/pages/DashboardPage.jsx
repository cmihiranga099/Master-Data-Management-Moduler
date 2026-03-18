import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function DashboardPage() {
  const [departments, setDepartments]   = useState([]);
  const [searchTerm, setSearchTerm]     = useState('');
  const [showModal, setShowModal]       = useState(false);
  const [editingDept, setEditingDept]   = useState(null);
  const [formData, setFormData]         = useState({ name: '', description: '' });
  const [formError, setFormError]       = useState('');
  const [loading, setLoading]           = useState(true);
  const [deleteId, setDeleteId]         = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';

  useEffect(() => { fetchDepartments(); }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get('/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error('Failed to fetch departments', err);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Filter by ID, name or description
  const filteredDepartments = searchTerm.trim() === ''
    ? departments
    : departments.filter((dept) => {
        const term = searchTerm.toLowerCase().trim();
        return (
          String(dept.id).includes(term) ||
          dept.name.toLowerCase().includes(term) ||
          (dept.description &&
            dept.description.toLowerCase().includes(term))
        );
      });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const openAddModal = () => {
    setEditingDept(null);
    setFormData({ name: '', description: '' });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setFormData({ name: dept.name, description: dept.description || '' });
    setFormError('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/departments/${id}`);
      setDepartments(departments.filter((d) => d.id !== id));
      setDeleteId(null);
    } catch (err) {
      alert('Failed to delete department.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formData.name.trim()) {
      setFormError('Department name is required.');
      return;
    }
    try {
      if (editingDept) {
        const res = await axiosInstance.put(
          `/departments/${editingDept.id}`, formData);
        setDepartments(departments.map((d) =>
          d.id === editingDept.id ? res.data : d));
      } else {
        const res = await axiosInstance.post('/departments', formData);
        setDepartments([...departments, res.data]);
      }
      setShowModal(false);
    } catch (err) {
      setFormError(
        err.response?.data?.message || 'Operation failed. Please try again.');
    }
  };

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <div style={styles.navLogo}>P</div>
          <span style={styles.navTitle}>Prime Engineering Lanka — MDM</span>
        </div>
        <div style={styles.navRight}>
          <span style={styles.navUser}>👤 {username}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.content}>

        {/* Page Header */}
        <div style={styles.pageHeader}>
          <div>
            <h2 style={styles.heading}>Department Management</h2>
            <p style={styles.subHeading}>
              Manage all departments in the system
            </p>
          </div>
          <button onClick={openAddModal} style={styles.addBtn}>
            + Add New Department
          </button>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{departments.length}</div>
            <div style={styles.statLabel}>Total Departments</div>
          </div>
          <div style={{...styles.statCard, borderLeftColor: '#3b82f6'}}>
            <div style={{...styles.statNumber, color: '#3b82f6'}}>
              {filteredDepartments.length}
            </div>
            <div style={styles.statLabel}>Search Results</div>
          </div>
        </div>

        {/* Search Bar + Table */}
        <div style={styles.tableWrapper}>

          {/* Search Bar */}
          <div style={styles.searchBar}>
            <div style={styles.searchInputWrapper}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, name or description..."
                style={styles.searchInput}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={styles.clearBtn}>
                  ✕
                </button>
              )}
            </div>
            {searchTerm && (
              <span style={styles.searchResultText}>
                Found {filteredDepartments.length} result
                {filteredDepartments.length !== 1 ? 's' : ''} for
                "{searchTerm}"
              </span>
            )}
          </div>

          {/* Table */}
          {loading ? (
            <div style={styles.loadingBox}>Loading departments...</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Department Name</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Created At</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartments.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={styles.emptyRow}>
                      {searchTerm
                        ? `No departments found matching "${searchTerm}"`
                        : 'No departments found. Click "Add New" to create one.'}
                    </td>
                  </tr>
                ) : (
                  filteredDepartments.map((dept) => (
                    <tr key={dept.id} style={styles.tr}>
                      <td style={styles.td}>
                        <span style={styles.idBadge}>
                          {highlightText(String(dept.id), searchTerm)}
                        </span>
                      </td>
                      <td style={{...styles.td, fontWeight: '600'}}>
                        {highlightText(dept.name, searchTerm)}
                      </td>
                      <td style={styles.td}>
                        {dept.description
                          ? highlightText(dept.description, searchTerm)
                          : '—'}
                      </td>
                      <td style={styles.td}>
                        {new Date(dept.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </td>
                      <td style={styles.td}>
                        <button
                          onClick={() => openEditModal(dept)}
                          style={styles.editBtn}>
                          ✏ Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(dept.id)}
                          style={styles.deleteBtn}>
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editingDept ? '✏ Edit Department' : '+ Add New Department'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={styles.closeBtn}>✕</button>
            </div>

            {formError && (
              <div style={styles.formError}>⚠ {formError}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Department Name <span style={{color:'red'}}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({...formData, name: e.target.value})}
                  style={styles.input}
                  placeholder="e.g. Engineering"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({...formData, description: e.target.value})}
                  style={{...styles.input, height:'100px', resize:'vertical'}}
                  placeholder="Optional description"
                />
              </div>
              <div style={styles.modalFooter}>
                <button type="submit" style={styles.submitBtn}>
                  {editingDept ? 'Update Department' : 'Create Department'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={styles.cancelBtn}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div style={styles.overlay}>
          <div style={{...styles.modal, maxWidth:'380px'}}>
            <h3 style={{margin:'0 0 12px', color:'#1a1a2e'}}>
              Confirm Delete
            </h3>
            <p style={{color:'#666', marginBottom:'24px'}}>
              Are you sure you want to delete this department?
              This action cannot be undone.
            </p>
            <div style={styles.modalFooter}>
              <button
                onClick={() => handleDelete(deleteId)}
                style={{...styles.submitBtn, background:'#c0392b'}}>
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                style={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper — highlight matching text in yellow
function highlightText(text, searchTerm) {
  if (!searchTerm || !text) return text;
  const term = searchTerm.trim();
  if (!term) return text;
  const regex = new RegExp(`(${term})`, 'gi');
  const parts = String(text).split(regex);
  return parts.map((part, i) =>
    part.toLowerCase() === term.toLowerCase() ? (
      <mark key={i} style={{
        background: '#fef08a',
        color: '#1a1a2e',
        borderRadius: '2px',
        padding: '0 2px',
      }}>
        {part}
      </mark>
    ) : part
  );
}

const styles = {
  page: { minHeight:'100vh', background:'#f4f6f9', fontFamily:'sans-serif' },
  navbar: {
    background:'#1a1a2e', color:'#fff', padding:'0 32px',
    height:'64px', display:'flex', alignItems:'center',
    justifyContent:'space-between',
    boxShadow:'0 2px 8px rgba(0,0,0,0.2)',
  },
  navLeft: { display:'flex', alignItems:'center', gap:'12px' },
  navLogo: {
    width:'36px', height:'36px', borderRadius:'8px',
    background:'#0f3460', color:'#fff', fontSize:'16px',
    fontWeight:'700', display:'flex',
    alignItems:'center', justifyContent:'center',
  },
  navTitle: { fontWeight:'700', fontSize:'16px' },
  navRight: { display:'flex', alignItems:'center', gap:'16px' },
  navUser: { fontSize:'13px', color:'#ccc' },
  logoutBtn: {
    background:'transparent',
    border:'1px solid rgba(255,255,255,0.3)',
    color:'#fff', padding:'7px 16px',
    borderRadius:'6px', cursor:'pointer', fontSize:'13px',
  },
  content: { maxWidth:'1100px', margin:'0 auto', padding:'32px 16px' },
  pageHeader: {
    display:'flex', justifyContent:'space-between',
    alignItems:'flex-start', marginBottom:'24px',
  },
  heading: { margin:0, fontSize:'24px', color:'#1a1a2e', fontWeight:'700' },
  subHeading: { margin:'4px 0 0', color:'#888', fontSize:'14px' },
  addBtn: {
    background:'#1a1a2e', color:'#fff', border:'none',
    padding:'12px 24px', borderRadius:'8px',
    cursor:'pointer', fontSize:'14px', fontWeight:'600',
    whiteSpace:'nowrap',
  },
  statsRow: { display:'flex', gap:'16px', marginBottom:'24px' },
  statCard: {
    background:'#fff', padding:'20px 28px', borderRadius:'12px',
    boxShadow:'0 2px 8px rgba(0,0,0,0.06)',
    borderLeft:'4px solid #1a1a2e',
  },
  statNumber: { fontSize:'32px', fontWeight:'700', color:'#1a1a2e' },
  statLabel: { fontSize:'13px', color:'#888', marginTop:'4px' },
  tableWrapper: {
    background:'#fff', borderRadius:'12px',
    boxShadow:'0 2px 12px rgba(0,0,0,0.07)', overflow:'hidden',
  },
  searchBar: {
    padding:'16px 20px', borderBottom:'1px solid #f1f5f9',
    display:'flex', alignItems:'center', gap:'16px', flexWrap:'wrap',
  },
  searchInputWrapper: {
    display:'flex', alignItems:'center',
    border:'1.5px solid #e5e7eb', borderRadius:'8px',
    padding:'0 12px', background:'#f8fafc',
    flex:1, minWidth:'250px',
  },
  searchIcon: { fontSize:'14px', marginRight:'8px', color:'#94a3b8' },
  searchInput: {
    border:'none', outline:'none', background:'transparent',
    padding:'10px 0', fontSize:'14px',
    color:'#374151', width:'100%', fontFamily:'sans-serif',
  },
  clearBtn: {
    background:'none', border:'none', cursor:'pointer',
    color:'#94a3b8', fontSize:'14px', padding:'4px',
  },
  searchResultText: {
    fontSize:'13px', color:'#64748b', whiteSpace:'nowrap',
  },
  loadingBox: { padding:'48px', textAlign:'center', color:'#888' },
  table: { width:'100%', borderCollapse:'collapse' },
  th: {
    background:'#f8fafc', padding:'14px 16px', textAlign:'left',
    fontSize:'11px', fontWeight:'700', color:'#64748b',
    textTransform:'uppercase', letterSpacing:'0.8px',
    borderBottom:'1px solid #e2e8f0',
  },
  tr: { borderBottom:'1px solid #f1f5f9' },
  td: { padding:'14px 16px', fontSize:'14px', color:'#374151' },
  idBadge: {
    background:'#f1f5f9', color:'#64748b',
    padding:'2px 8px', borderRadius:'4px', fontSize:'12px',
  },
  emptyRow: {
    padding:'48px', textAlign:'center',
    color:'#94a3b8', fontSize:'14px',
  },
  editBtn: {
    background:'#eff6ff', color:'#3b82f6',
    border:'1px solid #bfdbfe', padding:'6px 12px',
    borderRadius:'6px', cursor:'pointer',
    fontSize:'12px', marginRight:'8px', fontWeight:'500',
  },
  deleteBtn: {
    background:'#fff5f5', color:'#ef4444',
    border:'1px solid #fecaca', padding:'6px 12px',
    borderRadius:'6px', cursor:'pointer', fontSize:'12px', fontWeight:'500',
  },
  overlay: {
    position:'fixed', inset:0, background:'rgba(0,0,0,0.5)',
    display:'flex', alignItems:'center',
    justifyContent:'center', zIndex:1000, padding:'16px',
  },
  modal: {
    background:'#fff', borderRadius:'16px', padding:'32px',
    width:'100%', maxWidth:'480px',
    boxShadow:'0 20px 60px rgba(0,0,0,0.2)',
  },
  modalHeader: {
    display:'flex', justifyContent:'space-between',
    alignItems:'center', marginBottom:'24px',
  },
  modalTitle: { margin:0, fontSize:'18px', color:'#1a1a2e' },
  closeBtn: {
    background:'none', border:'none',
    fontSize:'18px', cursor:'pointer', color:'#888',
  },
  inputGroup: {
    display:'flex', flexDirection:'column',
    gap:'8px', marginBottom:'20px',
  },
  label: { fontSize:'13px', fontWeight:'600', color:'#374151' },
  input: {
    padding:'11px 14px', borderRadius:'8px',
    border:'1.5px solid #e5e7eb', fontSize:'14px',
    fontFamily:'sans-serif', outline:'none',
  },
  formError: {
    background:'#fff5f5', color:'#c0392b',
    border:'1px solid #fecaca', borderRadius:'8px',
    padding:'10px 14px', marginBottom:'20px', fontSize:'13px',
  },
  modalFooter: { display:'flex', gap:'12px', marginTop:'8px' },
  submitBtn: {
    background:'#1a1a2e', color:'#fff', border:'none',
    padding:'12px 24px', borderRadius:'8px',
    cursor:'pointer', fontSize:'14px', fontWeight:'600',
  },
  cancelBtn: {
    background:'#f1f5f9', color:'#475569', border:'none',
    padding:'12px 24px', borderRadius:'8px',
    cursor:'pointer', fontSize:'14px', fontWeight:'600',
  },
};

export default DashboardPage;