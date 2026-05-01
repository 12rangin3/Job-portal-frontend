// frontend/src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile, uploadResume } from '../api/userApi';
import { FaUser, FaSave, FaUpload, FaPlus, FaTrash } from 'react-icons/fa';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    bio: '',
    skills: [],
    experience: [],
    education: [],
    portfolio: '',
    linkedin: '',
    github: ''
  });
  const [skillInput, setSkillInput] = useState('');
  const [experienceInput, setExperienceInput] = useState({
    title: '', company: '', duration: '', description: ''
  });
  const [educationInput, setEducationInput] = useState({
    degree: '', institution: '', year: '', grade: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      const userData = response.data;
      setProfile(userData);
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        email: userData.email || '',
        bio: userData.bio || '',
        skills: userData.skills || [],
        experience: userData.experience || [],
        education: userData.education || [],
        portfolio: userData.portfolio || '',
        linkedin: userData.linkedin || '',
        github: userData.github || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    if (experienceInput.title && experienceInput.company) {
      setFormData(prev => ({
        ...prev,
        experience: [...prev.experience, { ...experienceInput }]
      }));
      setExperienceInput({ title: '', company: '', duration: '', description: '' });
    }
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    if (educationInput.degree && educationInput.institution) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, { ...educationInput }]
      }));
      setEducationInput({ degree: '', institution: '', year: '', grade: '' });
    }
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('resume', file);

    try {
      await uploadResume(formDataUpload);
      alert('Resume uploaded successfully!');
      fetchProfile(); // Refresh profile to show updated resume
    } catch (error) {
      alert('Failed to upload resume: ' + error.response?.data?.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProfile(formData);
      alert('Profile updated successfully!');
      fetchProfile();
    } catch (error) {
      alert('Failed to update profile: ' + error.response?.data?.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (user?.role !== 'jobseeker') {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          This page is only available for job seekers.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <FaUser className="me-2" />
                Edit Profile
              </h4>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="mb-4">
                  <h5 className="mb-3">Basic Information</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-4">
                  <label className="form-label">Bio</label>
                  <textarea
                    className="form-control"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <label className="form-label">Skills</label>
                  <div className="d-flex mb-2">
                    <input
                      type="text"
                      className="form-control me-2"
                      placeholder="Add a skill..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <button type="button" className="btn btn-outline-primary" onClick={addSkill}>
                      <FaPlus />
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="badge bg-secondary d-flex align-items-center">
                        {skill}
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-white ms-1 p-0"
                          onClick={() => removeSkill(index)}
                        >
                          <FaTrash size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div className="mb-4">
                  <label className="form-label">Experience</label>
                  <div className="border rounded p-3 mb-3">
                    <div className="row g-2">
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Job Title"
                          value={experienceInput.title}
                          onChange={(e) => setExperienceInput(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Company"
                          value={experienceInput.company}
                          onChange={(e) => setExperienceInput(prev => ({ ...prev, company: e.target.value }))}
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Duration (e.g., 2020-2023)"
                          value={experienceInput.duration}
                          onChange={(e) => setExperienceInput(prev => ({ ...prev, duration: e.target.value }))}
                        />
                      </div>
                      <div className="col-md-6">
                        <button type="button" className="btn btn-outline-primary w-100" onClick={addExperience}>
                          <FaPlus className="me-1" /> Add Experience
                        </button>
                      </div>
                      <div className="col-12">
                        <textarea
                          className="form-control"
                          placeholder="Description"
                          rows="2"
                          value={experienceInput.description}
                          onChange={(e) => setExperienceInput(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                  {formData.experience.map((exp, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center border-bottom py-2">
                      <div>
                        <strong>{exp.title}</strong> at {exp.company} ({exp.duration})
                        <p className="mb-0 small text-muted">{exp.description}</p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeExperience(index)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div className="mb-4">
                  <label className="form-label">Education</label>
                  <div className="border rounded p-3 mb-3">
                    <div className="row g-2">
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Degree"
                          value={educationInput.degree}
                          onChange={(e) => setEducationInput(prev => ({ ...prev, degree: e.target.value }))}
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Institution"
                          value={educationInput.institution}
                          onChange={(e) => setEducationInput(prev => ({ ...prev, institution: e.target.value }))}
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Year"
                          value={educationInput.year}
                          onChange={(e) => setEducationInput(prev => ({ ...prev, year: e.target.value }))}
                        />
                      </div>
                      <div className="col-md-6">
                        <button type="button" className="btn btn-outline-primary w-100" onClick={addEducation}>
                          <FaPlus className="me-1" /> Add Education
                        </button>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Grade/GPA"
                          value={educationInput.grade}
                          onChange={(e) => setEducationInput(prev => ({ ...prev, grade: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                  {formData.education.map((edu, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center border-bottom py-2">
                      <div>
                        <strong>{edu.degree}</strong> from {edu.institution} ({edu.year})
                        {edu.grade && <p className="mb-0 small text-muted">Grade: {edu.grade}</p>}
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeEducation(index)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Links */}
                <div className="mb-4">
                  <h5 className="mb-3">Links</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Portfolio Website</label>
                      <input
                        type="url"
                        className="form-control"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleInputChange}
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">LinkedIn Profile</label>
                      <input
                        type="url"
                        className="form-control"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">GitHub Profile</label>
                      <input
                        type="url"
                        className="form-control"
                        name="github"
                        value={formData.github}
                        onChange={handleInputChange}
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="mb-4">
                  <label className="form-label">Resume</label>
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                    />
                    <FaUpload />
                  </div>
                  {profile?.resume && (
                    <small className="text-muted">
                      Current resume: {profile.resume.split('/').pop()}
                    </small>
                  )}
                </div>

                {/* Submit Button */}
                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    <FaSave className="me-2" />
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;