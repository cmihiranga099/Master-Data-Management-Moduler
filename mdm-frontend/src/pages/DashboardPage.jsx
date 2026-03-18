import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function DashboardPage() {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm]   = useState('');
  const [showModal, setShowModal]     = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData]       = useState({ name: '', description: '' });
  const [formError, setFormError]     = useState('');
  const [loading, setLoading]         = useState(true);
  const [deleteId, setDeleteId]       = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';

  useEffect(() => { fetchDepartments(); }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get('/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error('Failed to fetch', err);
    } finally {
      setLoading(false);
    }
  };

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
      setFormError(err.response?.data?.message || 'Operation failed.');
    }
  };

  return (
    <div style={{
      width: '100vw', minHeight: '100vh',
      background: '#f0f4ff', margin: 0, padding: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
      boxSizing: 'border-box', overflowX: 'hidden'
    }}>

      {/* Navbar */}
      <nav style={{
        width: '100%',
        background: 'linear-gradient(135deg, #0f0c29, #302b63)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        position: 'sticky', top: 0, zIndex: 40
      }}>
        <div style={{
          width: '100%', maxWidth: '1400px',
          margin: '0 auto', padding: '0 32px',
          height: '64px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          boxSizing: 'border-box'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0
            }}>
              <svg style={{width: '20px', height: '20px', color: '#fff'}}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
              </svg>
            </div>
            <div>
              <div style={{color: '#fff', fontWeight: '700', fontSize: '15px', lineHeight: 1.2}}>
                Master Data Management System
              </div>
              <div style={{color: 'rgba(255,255,255,0.4)', fontSize: '11px'}}>
                Department Module
              </div>
            </div>
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '10px', padding: '6px 14px'
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '12px',
                fontWeight: '700', color: '#fff', flexShrink: 0
              }}>
                {username.charAt(0).toUpperCase()}
              </div>
              <span style={{color: '#fff', fontSize: '13px'}}>{username}</span>
            </div>
            <button onClick={handleLogout}
              style={{
                padding: '8px 18px', borderRadius: '10px',
                fontSize: '13px', fontWeight: '500',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.85)',
                background: 'transparent', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e =>
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e =>
                e.currentTarget.style.background = 'transparent'}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div style={{
        width: '100%', maxWidth: '1400px',
        margin: '0 auto', padding: '36px 32px',
        boxSizing: 'border-box'
      }}>

        {/* Page Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '28px', flexWrap: 'wrap', gap: '16px'
        }}>
          <div>
            <h1 style={{
              margin: '0 0 6px', fontSize: '26px',
              fontWeight: '800', color: '#1e293b', letterSpacing: '-0.5px'
            }}>
              Department Management
            </h1>
            <p style={{margin: 0, color: '#64748b', fontSize: '14px'}}>
              Manage and organize all departments
            </p>
          </div>
          <button onClick={openAddModal}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '12px',
              fontSize: '14px', fontWeight: '600',
              color: '#fff', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              boxShadow: '0 4px 15px rgba(79,70,229,0.4)',
              whiteSpace: 'nowrap', transition: 'all 0.2s'
            }}
            onMouseEnter={e =>
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(79,70,229,0.55)'}
            onMouseLeave={e =>
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(79,70,229,0.4)'}>
            <svg style={{width: '16px', height: '16px'}}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth={2.5} d="M12 4v16m8-8H4"/>
            </svg>
            Add New Department
          </button>
        </div>

        {/* Stats Cards — Updated */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '28px'
        }}>
          {[
            {
              label: 'Total Departments',
              value: departments.length,
              color: '#4f46e5',
              lightColor: '#eef2ff',
              icon: (
                <svg style={{width: '26px', height: '26px'}}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              )
            },
            {
              label: 'Search Results',
              value: filteredDepartments.length,
              color: '#0891b2',
              lightColor: '#ecfeff',
              icon: (
                <svg style={{width: '26px', height: '26px'}}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              )
            },
          ].map((stat) => (
            <div key={stat.label}
              style={{
                background: '#fff',
                borderRadius: '20px',
                padding: '24px 28px',
                border: '1px solid #e8edf5',
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow =
                  '0 12px 28px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 2px 12px rgba(0,0,0,0.05)';
              }}>

              {/* Icon Box */}
              <div style={{
                width: '60px', height: '60px',
                borderRadius: '16px',
                background: stat.lightColor,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                color: stat.color, flexShrink: 0
              }}>
                {stat.icon}
              </div>

              {/* Text */}
              <div style={{flex: 1}}>
                <div style={{
                  fontSize: '40px', fontWeight: '800',
                  color: stat.color, lineHeight: 1,
                  marginBottom: '6px'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '12px', fontWeight: '600',
                  color: '#94a3b8', textTransform: 'uppercase',
                  letterSpacing: '0.8px'
                }}>
                  {stat.label}
                </div>
              </div>

              {/* Decorative circle */}
              <div style={{
                width: '48px', height: '48px',
                borderRadius: '50%',
                background: stat.lightColor,
                opacity: 0.5, flexShrink: 0
              }}/>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div style={{
          width: '100%', background: '#fff',
          borderRadius: '20px', border: '1px solid #e8edf5',
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          boxSizing: 'border-box'
        }}>

          {/* Search Bar */}
          <div style={{
            padding: '18px 24px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', gap: '16px'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              flex: 1, minWidth: '260px', borderRadius: '12px',
              padding: '11px 16px',
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              boxSizing: 'border-box'
            }}>
              <svg style={{width: '16px', height: '16px', color: '#94a3b8', flexShrink: 0}}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, name or description..."
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  background: 'transparent', fontSize: '14px',
                  color: '#374151', minWidth: 0
                }}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')}
                  style={{
                    background: 'none', border: 'none',
                    color: '#94a3b8', cursor: 'pointer',
                    fontSize: '20px', lineHeight: 1,
                    fontWeight: '700', padding: 0, flexShrink: 0
                  }}>
                  ×
                </button>
              )}
            </div>
            {searchTerm && (
              <span style={{fontSize: '13px', color: '#64748b'}}>
                <span style={{fontWeight: '700', color: '#4f46e5'}}>
                  {filteredDepartments.length}
                </span> result{filteredDepartments.length !== 1 ? 's' : ''} for "
                <span style={{fontWeight: '600', color: '#374151'}}>
                  {searchTerm}
                </span>"
              </span>
            )}
          </div>

          {/* Table */}
          {loading ? (
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 24px', gap: '12px'
            }}>
              <svg style={{
                width: '26px', height: '26px', color: '#4f46e5',
                animation: 'spin 1s linear infinite'
              }} viewBox="0 0 24 24" fill="none">
                <circle style={{opacity: 0.25}} cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"/>
                <path style={{opacity: 0.75}} fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <span style={{color: '#64748b', fontSize: '14px'}}>
                Loading departments...
              </span>
            </div>
          ) : (
            <div style={{width: '100%', overflowX: 'auto'}}>
              <table style={{
                width: '100%', borderCollapse: 'collapse',
                minWidth: '700px'
              }}>
                <thead>
                  <tr style={{
                    background: '#f8fafc',
                    borderBottom: '2px solid #e8edf5'
                  }}>
                    {['ID','Department Name','Description','Created At','Actions']
                      .map(h => (
                        <th key={h} style={{
                          textAlign: 'left', padding: '14px 24px',
                          fontSize: '11px', fontWeight: '700',
                          color: '#64748b', textTransform: 'uppercase',
                          letterSpacing: '0.8px', whiteSpace: 'nowrap'
                        }}>
                          {h}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredDepartments.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{
                        padding: '64px 24px', textAlign: 'center'
                      }}>
                        <div style={{
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', gap: '12px'
                        }}>
                          <div style={{
                            width: '56px', height: '56px',
                            borderRadius: '16px', background: '#f0f4ff',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <svg style={{width: '28px', height: '28px', color: '#818cf8'}}
                              fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                          </div>
                          <div style={{color: '#94a3b8', fontSize: '14px'}}>
                            {searchTerm
                              ? `No results for "${searchTerm}"`
                              : 'No departments yet'}
                          </div>
                          {!searchTerm && (
                            <button onClick={openAddModal}
                              style={{
                                color: '#4f46e5', fontSize: '14px',
                                fontWeight: '600', background: 'none',
                                border: 'none', cursor: 'pointer'
                              }}>
                              + Add your first department
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : filteredDepartments.map((dept, idx) => (
                    <tr key={dept.id}
                      style={{
                        borderBottom: idx < filteredDepartments.length - 1
                          ? '1px solid #f1f5f9' : 'none',
                        background: '#fff', transition: 'background 0.15s'
                      }}
                      onMouseEnter={e =>
                        e.currentTarget.style.background = '#f5f3ff'}
                      onMouseLeave={e =>
                        e.currentTarget.style.background = '#fff'}>

                      {/* ID */}
                      <td style={{padding: '16px 24px', whiteSpace: 'nowrap'}}>
                        <span style={{
                          background: '#eef2ff', color: '#4f46e5',
                          padding: '4px 10px', borderRadius: '8px',
                          fontSize: '12px', fontWeight: '700'
                        }}>
                          #{String(dept.id)}
                        </span>
                      </td>

                      {/* Name */}
                      <td style={{padding: '16px 24px', whiteSpace: 'nowrap'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                          <div style={{
                            width: '36px', height: '36px',
                            borderRadius: '10px', flexShrink: 0,
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px', fontWeight: '700', color: '#fff',
                            background: `hsl(${(dept.id * 60) % 360}, 65%, 55%)`
                          }}>
                            {dept.name.charAt(0).toUpperCase()}
                          </div>
                          <span style={{fontWeight: '600', color: '#1e293b', fontSize: '14px'}}>
                            {highlightText(dept.name, searchTerm)}
                          </span>
                        </div>
                      </td>

                      {/* Description */}
                      <td style={{
                        padding: '16px 24px', color: '#64748b',
                        fontSize: '14px', maxWidth: '320px'
                      }}>
                        {dept.description
                          ? highlightText(dept.description, searchTerm)
                          : <span style={{color: '#cbd5e1', fontStyle: 'italic'}}>
                              No description
                            </span>}
                      </td>

                      {/* Created At */}
                      <td style={{padding: '16px 24px', whiteSpace: 'nowrap'}}>
                        <div style={{
                          display: 'flex', alignItems: 'center',
                          gap: '6px', color: '#64748b', fontSize: '13px'
                        }}>
                          <svg style={{width: '14px', height: '14px', color: '#94a3b8'}}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          {new Date(dept.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{padding: '16px 24px', whiteSpace: 'nowrap'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                          <button onClick={() => openEditModal(dept)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              padding: '7px 14px', borderRadius: '8px',
                              fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                              background: '#eef2ff', color: '#4f46e5',
                              border: '1px solid #c7d2fe', transition: 'all 0.15s'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = '#4f46e5';
                              e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = '#eef2ff';
                              e.currentTarget.style.color = '#4f46e5';
                            }}>
                            <svg style={{width: '12px', height: '12px'}}
                              fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            Edit
                          </button>

                          <button onClick={() => setDeleteId(dept.id)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              padding: '7px 14px', borderRadius: '8px',
                              fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                              background: '#fef2f2', color: '#ef4444',
                              border: '1px solid #fecaca', transition: 'all 0.15s'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = '#ef4444';
                              e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = '#fef2f2';
                              e.currentTarget.style.color = '#ef4444';
                            }}>
                            <svg style={{width: '12px', height: '12px'}}
                              fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '16px',
          background: 'rgba(15,12,41,0.75)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)'
        }}>
          <div style={{
            width: '100%', maxWidth: '460px',
            borderRadius: '20px', overflow: 'hidden',
            background: '#fff',
            boxShadow: '0 25px 60px rgba(0,0,0,0.35)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #0f0c29, #302b63)',
              padding: '20px 24px', display: 'flex',
              alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{color: '#fff', fontWeight: '700', fontSize: '16px', margin: 0}}>
                  {editingDept ? 'Edit Department' : 'Add New Department'}
                </h3>
                <p style={{color: 'rgba(255,255,255,0.45)', fontSize: '12px', margin: '4px 0 0'}}>
                  {editingDept ? 'Update department details' : 'Fill in the details below'}
                </p>
              </div>
              <button onClick={() => setShowModal(false)}
                style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                  border: 'none', cursor: 'pointer', fontSize: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>✕
              </button>
            </div>

            <div style={{padding: '24px'}}>
              {formError && (
                <div style={{
                  background: '#fef2f2', border: '1px solid #fecaca',
                  color: '#dc2626', borderRadius: '10px',
                  padding: '12px 16px', marginBottom: '20px', fontSize: '13px'
                }}>
                  ⚠ {formError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{marginBottom: '20px'}}>
                  <label style={{
                    display: 'block', fontSize: '13px',
                    fontWeight: '600', color: '#374151', marginBottom: '8px'
                  }}>
                    Department Name <span style={{color: '#ef4444'}}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Engineering"
                    style={{
                      width: '100%', padding: '12px 16px',
                      borderRadius: '10px', fontSize: '14px',
                      border: '2px solid #e8edf5',
                      background: '#f8fafc', outline: 'none',
                      boxSizing: 'border-box', transition: 'border 0.2s'
                    }}
                    onFocus={e => e.target.style.border = '2px solid #4f46e5'}
                    onBlur={e => e.target.style.border = '2px solid #e8edf5'}
                  />
                </div>

                <div style={{marginBottom: '24px'}}>
                  <label style={{
                    display: 'block', fontSize: '13px',
                    fontWeight: '600', color: '#374151', marginBottom: '8px'
                  }}>
                    Description{' '}
                    <span style={{color: '#9ca3af', fontWeight: '400'}}>(optional)</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({...formData, description: e.target.value})}
                    placeholder="Enter department description..."
                    rows={3}
                    style={{
                      width: '100%', padding: '12px 16px',
                      borderRadius: '10px', fontSize: '14px',
                      border: '2px solid #e8edf5',
                      background: '#f8fafc', outline: 'none',
                      resize: 'none', fontFamily: 'inherit',
                      boxSizing: 'border-box', transition: 'border 0.2s'
                    }}
                    onFocus={e => e.target.style.border = '2px solid #4f46e5'}
                    onBlur={e => e.target.style.border = '2px solid #e8edf5'}
                  />
                </div>

                <div style={{display: 'flex', gap: '12px'}}>
                  <button type="submit"
                    style={{
                      flex: 1, padding: '13px', borderRadius: '10px',
                      fontSize: '14px', fontWeight: '600',
                      color: '#fff', border: 'none', cursor: 'pointer',
                      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                      boxShadow: '0 4px 15px rgba(79,70,229,0.35)'
                    }}>
                    {editingDept ? 'Update Department' : 'Create Department'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)}
                    style={{
                      flex: 1, padding: '13px', borderRadius: '10px',
                      fontSize: '14px', fontWeight: '600',
                      color: '#475569', background: '#f1f5f9',
                      border: 'none', cursor: 'pointer'
                    }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '16px',
          background: 'rgba(15,12,41,0.75)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)'
        }}>
          <div style={{
            width: '100%', maxWidth: '360px',
            borderRadius: '20px', padding: '32px 24px',
            background: '#fff', textAlign: 'center',
            boxShadow: '0 25px 60px rgba(0,0,0,0.35)'
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: '#fef2f2', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <svg style={{width: '28px', height: '28px', color: '#ef4444'}}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>
            <h3 style={{fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px'}}>
              Delete Department?
            </h3>
            <p style={{color: '#64748b', fontSize: '14px', margin: '0 0 24px', lineHeight: '1.6'}}>
              This action cannot be undone. The department will be permanently removed.
            </p>
            <div style={{display: 'flex', gap: '12px'}}>
              <button onClick={() => handleDelete(deleteId)}
                style={{
                  flex: 1, padding: '13px', borderRadius: '10px',
                  fontSize: '14px', fontWeight: '600',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  boxShadow: '0 4px 15px rgba(239,68,68,0.3)'
                }}>
                Yes, Delete
              </button>
              <button onClick={() => setDeleteId(null)}
                style={{
                  flex: 1, padding: '13px', borderRadius: '10px',
                  fontSize: '14px', fontWeight: '600',
                  color: '#475569', background: '#f1f5f9',
                  border: 'none', cursor: 'pointer'
                }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function highlightText(text, searchTerm) {
  if (!searchTerm || !text) return text;
  const term = searchTerm.trim();
  if (!term) return text;
  const regex = new RegExp(`(${term})`, 'gi');
  const parts = String(text).split(regex);
  return parts.map((part, i) =>
    part.toLowerCase() === term.toLowerCase() ? (
      <mark key={i} style={{
        background: '#fef08a', color: '#1a1a2e',
        borderRadius: '3px', padding: '0 2px'
      }}>
        {part}
      </mark>
    ) : part
  );
}

export default DashboardPage;