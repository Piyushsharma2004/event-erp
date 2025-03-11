'use client';
import React, { useState, useEffect } from 'react';

// Mock data structure that simulates database response
const mockStudentData = [
  { id: 1, name: 'Piyush Sharma', email: 'piyush.22bcon613@jecrcu.edu.in', year: '2022', department: 'CSE', program: 'B.Tech' },
  { id: 2, name: 'Ananya Verma', email: 'ananya.22bcon247@jecrcu.edu.in', year: '2022', department: 'CSE', program: 'B.Tech' },
  { id: 3, name: 'Rahul Singh', email: 'rahul.23bban118@jecrcu.edu.in', year: '2023', department: 'BBA', program: 'BBA' },
  { id: 4, name: 'Neha Gupta', email: 'neha.21bmec056@jecrcu.edu.in', year: '2021', department: 'MECH', program: 'B.Tech' },
  { id: 5, name: 'Amit Kumar', email: 'amit.24bele123@jecrcu.edu.in', year: '2024', department: 'ELE', program: 'B.Tech' },
  { id: 6, name: 'Priya Patel', email: 'priya.23bban095@jecrcu.edu.in', year: '2023', department: 'BBA', program: 'BBA' },
];

function EmailsAdminPage() {
  // States for data and UI
  const [students, setStudents] = useState<{ id: number; name: string; email: string; year: string; department: string; program: string; }[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [fileAttachment, setFileAttachment] = useState<File | null>(null);
  const [eventLink, setEventLink] = useState('');
  const [formLink, setFormLink] = useState('');
  
  // Filter states
  const [yearFilter, setYearFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [programFilter, setProgramFilter] = useState('');

  // Email sender settings
  const [showSettings, setShowSettings] = useState(false);
  const [emailProvider, setEmailProvider] = useState('smtp');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [smtpServer, setSmtpServer] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [useSSL, setUseSSL] = useState(true);
  interface EmailConfig {
    id: string;
    name: string;
    senderName: string;
    senderEmail: string;
    emailProvider: string;
    smtpServer: string;
    smtpPort: string;
    username: string;
    password: string;
    useSSL: boolean;
  }

  const [savedConfigs, setSavedConfigs] = useState<EmailConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState('');

  // Sending status
  const [isSending, setIsSending] = useState(false);
  const [currentSendingIndex, setCurrentSendingIndex] = useState(0);
  const [sendingProgress, setSendingProgress] = useState(0);
  interface SendingError {
    email: string;
    error: string;
  }
  
  const [sendingErrors, setSendingErrors] = useState<SendingError[]>([]);
  
  // Template options
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templates, setTemplates] = useState([
    { id: 'event', name: 'Event Announcement', subject: 'Join Us: {{eventName}} on {{eventDate}}', body: 'Dear {{studentName}},\n\nWe are excited to invite you to {{eventName}} taking place on {{eventDate}} at {{eventLocation}}.\n\n{{eventDescription}}\n\nRegister here: {{registrationLink}}\n\nRegards,\nEvent Team' },
    { id: 'reminder', name: 'Event Reminder', subject: 'Reminder: {{eventName}} Tomorrow', body: 'Dear {{studentName}},\n\nThis is a friendly reminder that {{eventName}} is scheduled for tomorrow at {{eventTime}}, {{eventLocation}}.\n\nWe look forward to seeing you there!\n\nRegards,\nEvent Team' }
  ]);
  const [templateVars, setTemplateVars] = useState({
    eventName: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    eventDescription: '',
    registrationLink: ''
  });

  // Unique values for filters
  const [uniqueYears, setUniqueYears] = useState<string[]>([]);
  const [uniqueDepartments, setUniqueDepartments] = useState<string[]>([]);
  const [uniquePrograms, setUniquePrograms] = useState<string[]>([]);

  // Load student data (simulating database fetch)
  useEffect(() => {
    // In a real app, this would be an API call
    setStudents(mockStudentData);
    
    // Extract unique values for filters
    setUniqueYears(Array.from(new Set(mockStudentData.map(student => student.year))));
    setUniqueDepartments(Array.from(new Set(mockStudentData.map(student => student.department))));
    setUniquePrograms(Array.from(new Set(mockStudentData.map(student => student.program))));
    
    
    // Load saved email configurations from localStorage
    const savedEmailConfigs = localStorage.getItem('emailConfigs');
    if (savedEmailConfigs) {
      setSavedConfigs(JSON.parse(savedEmailConfigs));
    }
  }, []);

  // Helper function to parse email and extract information
  const parseEmailInfo = (email: string) => {
    // Example: piyush.22bcon613@jecrcu.edu.in
    const regex = /^([^.]+)\.(\d{2})([a-z]+)(\d+)@jecrcu\.edu\.in$/i;
    const match = email.match(regex);
    
    if (match) {
      const [, name, year, deptCode, studentNo] = match;
      let department = '';
      let program = '';
      
      // Department codes mapping
      switch(deptCode.toLowerCase()) {
        case 'bcon': department = 'CSE'; program = 'B.Tech'; break;
        case 'bmec': department = 'MECH'; program = 'B.Tech'; break;
        case 'bele': department = 'ELE'; program = 'B.Tech'; break;
        case 'bciv': department = 'CIVIL'; program = 'B.Tech'; break;
        case 'bban': department = 'BBA'; program = 'BBA'; break;
        default: department = deptCode.toUpperCase(); program = 'Other';
      }
      
      return {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        year: `20${year}`,
        department,
        program,
        studentNo
      };
    }
    
    return null;
  };

  // Filter students based on criteria
  const filteredStudents = students.filter(student => {
    // Search filter
    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) || 
                         student.email.toLowerCase().includes(search.toLowerCase());
    
    // Year filter
    const matchesYear = yearFilter ? student.year === yearFilter : true;
    
    // Department filter
    const matchesDepartment = departmentFilter ? student.department === departmentFilter : true;
    
    // Program filter
    const matchesProgram = programFilter ? student.program === programFilter : true;
    
    return matchesSearch && matchesYear && matchesDepartment && matchesProgram;
  });

  const toggleEmailSelection = (email: string) => {
    setSelectedEmails(prev =>
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  const selectAll = () => {
    setSelectedEmails(filteredStudents.map(student => student.email));
  };

  const deselectAll = () => {
    setSelectedEmails([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileAttachment(e.target.files[0]);
    }
  };

  const validateEmailSettings = () => {
    if (!senderName || !senderEmail) {
      alert('Please provide sender name and email');
      return false;
    }
    
    if (emailProvider === 'smtp') {
      if (!smtpServer || !smtpPort || !username || !password) {
        alert('Please fill in all SMTP server details');
        return false;
      }
    }
    
    return true;
  };

  const saveEmailConfig = () => {
    if (!validateEmailSettings()) return;
    
    const configName = prompt('Enter a name for this email configuration:');
    if (!configName) return;
    
    const newConfig = {
      id: Date.now().toString(),
      name: configName,
      senderName,
      senderEmail,
      emailProvider,
      smtpServer,
      smtpPort,
      username,
      password: btoa(password), // Basic encoding, not secure for production
      useSSL
    };
    
    const updatedConfigs = [...savedConfigs, newConfig];
    setSavedConfigs(updatedConfigs);
    localStorage.setItem('emailConfigs', JSON.stringify(updatedConfigs));
    alert('Email configuration saved!');
  };

  const loadEmailConfig = (configId: string) => {
    const config = savedConfigs.find(cfg => cfg.id === configId);
    if (!config) return;
    
    setSenderName(config.senderName);
    setSenderEmail(config.senderEmail);
    setEmailProvider(config.emailProvider);
    setSmtpServer(config.smtpServer);
    setSmtpPort(config.smtpPort);
    setUsername(config.username);
    setPassword(atob(config.password)); // Decode password
    setUseSSL(config.useSSL);
  };

  const deleteEmailConfig = (configId: string) => {
    if (confirm('Are you sure you want to delete this configuration?')) {
      const updatedConfigs = savedConfigs.filter(cfg => cfg.id !== configId);
      setSavedConfigs(updatedConfigs);
      localStorage.setItem('emailConfigs', JSON.stringify(updatedConfigs));
      
      if (selectedConfig === configId) {
        setSelectedConfig('');
      }
    }
  };

  const handleTemplateSelection = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setSubject(template.subject);
      setMessage(template.body);
    }
  };

  const applyTemplateVariables = (text: string, studentEmail: string) => {
    // Find the student based on email
    const student = students.find(s => s.email === studentEmail);
    const studentInfo = student ? parseEmailInfo(student.email) : null;
    
    // Replace all template variables with actual values
    let processedText = text;
    
    // Replace student-specific variables
    if (student && studentInfo) {
      processedText = processedText.replace(/{{studentName}}/g, student.name);
      processedText = processedText.replace(/{{department}}/g, studentInfo.department);
      processedText = processedText.replace(/{{batchYear}}/g, studentInfo.year);
      processedText = processedText.replace(/{{program}}/g, studentInfo.program);
    }
    
    // Replace event variables
    Object.entries(templateVars).forEach(([key, value]) => {
      processedText = processedText.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    
    return processedText;
  };

  const sendEmails = async () => {
    if (selectedEmails.length === 0 || !subject || !message) {
      alert('Please select recipients and fill out subject & message.');
      return;
    }
    
    if (!validateEmailSettings()) {
      return;
    }
    
    // In a real application, we would make API calls to send emails
    setIsSending(true);
    setSendingProgress(0);
    setCurrentSendingIndex(0);
    setSendingErrors([]);
    
    try {
      // Simulate sending emails one by one
      for (let i = 0; i < selectedEmails.length; i++) {
        setCurrentSendingIndex(i);
        
        // Process any template variables for personalization
        const personalizedSubject = applyTemplateVariables(subject, selectedEmails[i]);
        const personalizedMessage = applyTemplateVariables(message, selectedEmails[i]);
        
        try {
          // In a real app, this would be an API call to your backend
          // For example:
          // await fetch('/api/send-email', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({
          //     to: selectedEmails[i],
          //     subject: personalizedSubject,
          //     message: personalizedMessage,
          //     senderName,
          //     senderEmail,
          //     smtpSettings: emailProvider === 'smtp' ? {
          //       server: smtpServer,
          //       port: smtpPort,
          //       username,
          //       password,
          //       useSSL
          //     } : null,
          //     attachments: fileAttachment ? [fileAttachment] : [],
          //     eventLink,
          //     formLink
          //   })
          // });
          
          // Simulate API call with delay
          await new Promise(resolve => setTimeout(resolve, 100));
          
          if (Math.random() > 0.95) {
            throw new Error(`Failed to send to ${selectedEmails[i]}`);
          }
        } catch (error) {
          setSendingErrors(prev => [...prev, { email: selectedEmails[i], error: (error as Error).message }]);
          if (error instanceof Error) {
            setSendingErrors(prev => [...prev, { email: selectedEmails[i], error: error.message }]);
          } else {
            setSendingErrors(prev => [...prev, { email: selectedEmails[i], error: 'Unknown error' }]);
          }
        }
        
        // Update progress
        setSendingProgress(Math.round(((i + 1) / selectedEmails.length) * 100));
      }
      
      // Create log entry with details
      const timestamp = new Date().toLocaleString();
      const successCount = selectedEmails.length - sendingErrors.length;
      const attachmentInfo = fileAttachment ? `with attachment: ${fileAttachment.name}` : 'without attachments';
      const linksInfo = (eventLink || formLink) ? 
        `Links: ${eventLink ? 'Event' : ''}${(eventLink && formLink) ? ', ' : ''}${formLink ? 'Form' : ''}` : 
        'without links';
      
      // Group emails by department and year for the log
      const emailsByGroup: { [key: string]: number } = {};
      selectedEmails.forEach(email => {
        const info = parseEmailInfo(email);
        if (info) {
          const key = `${info.program} ${info.year} (${info.department})`;
          if (!emailsByGroup[key]) emailsByGroup[key] = 0;
          emailsByGroup[key]++;
        }
      });
      
      const groupSummary = Object.entries(emailsByGroup)
        .map(([group, count]) => `${group}: ${count} students`)
        .join(', ');
      
      const newLog = `[${timestamp}] Sent ${successCount}/${selectedEmails.length} emails (${groupSummary}) ${attachmentInfo}, ${linksInfo}`;
      setLogs([newLog, ...logs]);
      
      alert(`Email sending complete. ${successCount} emails sent successfully, ${sendingErrors.length} failed.`);
      
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error sending emails: ${error.message}`);
      } else {
        alert('Error sending emails: Unknown error');
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full p-4 max-w-6xl mx-auto">
      <h1 className="text-center text-2xl font-bold mb-4">Email Promotion System</h1>
      
      {/* Tabs for main sections */}
      <div className="flex border-b mb-4">
        <button 
          className={`py-2 px-4 ${!showSettings ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setShowSettings(false)}
        >
          Compose Email
        </button>
        <button 
          className={`py-2 px-4 ${showSettings ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setShowSettings(true)}
        >
          Email Settings
        </button>
      </div>
      
      {showSettings ? (
        <div className="bg-white border rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Email Sender Configuration</h2>
          
          {/* Saved configs selector */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Saved Configurations</label>
              <select 
                className="w-full p-2 border rounded"
                value={selectedConfig}
                onChange={(e) => {
                  setSelectedConfig(e.target.value);
                  if (e.target.value) loadEmailConfig(e.target.value);
                }}
              >
                <option value="">Select a saved configuration</option>
                {savedConfigs.map(config => (
                  <option key={config.id} value={config.id}>{config.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button 
                onClick={() => saveEmailConfig()}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Save Current
              </button>
              {selectedConfig && (
                <button 
                  onClick={() => deleteEmailConfig(selectedConfig)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
          
          {/* Sender Information */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Sender Name</label>
              <input
                type="text"
                placeholder="College Event Team"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sender Email</label>
              <input
                type="email"
                placeholder="events@university.edu"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          {/* Email Provider Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email Provider</label>
            <select
              value={emailProvider}
              onChange={(e) => setEmailProvider(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="smtp">SMTP Server</option>
              <option value="gmail">Gmail API</option>
              <option value="sendgrid">SendGrid</option>
            </select>
          </div>
          
          {/* SMTP Settings */}
          {emailProvider === 'smtp' && (
            <div className="border p-4 rounded mb-4">
              <h3 className="font-medium mb-2">SMTP Server Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">SMTP Server</label>
                  <input
                    type="text"
                    placeholder="smtp.example.com"
                    value={smtpServer}
                    onChange={(e) => setSmtpServer(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SMTP Port</label>
                  <input
                    type="text"
                    placeholder="587"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <input
                    type="text"
                    placeholder="user@example.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={useSSL}
                    onChange={(e) => setUseSSL(e.target.checked)}
                    className="mr-2"
                  />
                  <span>Use SSL/TLS</span>
                </label>
              </div>
            </div>
          )}
          
          {/* Gmail API Settings */}
          {emailProvider === 'gmail' && (
            <div className="border p-4 rounded mb-4">
              <h3 className="font-medium mb-2">Gmail API Settings</h3>
              <p className="mb-4">To use Gmail API, you need to set up OAuth2 credentials.</p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Client ID</label>
                <input
                  type="text"
                  placeholder="Your Google Client ID"
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Client Secret</label>
                <input
                  type="password"
                  placeholder="Your Google Client Secret"
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Authenticate with Google
              </button>
            </div>
          )}
          
          {/* SendGrid Settings */}
          {emailProvider === 'sendgrid' && (
            <div className="border p-4 rounded mb-4">
              <h3 className="font-medium mb-2">SendGrid API Settings</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">API Key</label>
                <input
                  type="password"
                  placeholder="Your SendGrid API Key"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          )}
          
          <button 
            onClick={() => validateEmailSettings() && setShowSettings(false)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Settings & Continue
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Batch Year</label>
              <select 
                className="w-full p-2 border rounded"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="">All Years</option>
                {uniqueYears.sort().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <select 
                className="w-full p-2 border rounded"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                {uniqueDepartments.sort().map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Program</label>
              <select 
                className="w-full p-2 border rounded"
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
              >
                <option value="">All Programs</option>
                {uniquePrograms.sort().map(program => (
                  <option key={program} value={program}>{program}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold">Recipients ({filteredStudents.length} students found)</h2>
              <div>
                <button 
                  onClick={selectAll} 
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2 text-sm"
                >
                  Select All
                </button>
                <button 
                  onClick={deselectAll} 
                  className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                >
                  Deselect All
                </button>
              </div>
            </div>
            
            <div className="max-h-64 overflow-y-auto border bg-white rounded">
              {filteredStudents.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-12 px-3 py-2"></th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Program</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Batch</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map(student => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={selectedEmails.includes(student.email)}
                            onChange={() => toggleEmailSelection(student.email)}
                            className="h-4 w-4"
                          />
                        </td>
                        <td className="px-3 py-2">{student.name}</td>
                        <td className="px-3 py-2 text-sm text-gray-500">{student.email}</td>
                        <td className="px-3 py-2 text-sm">{student.program}</td>
                        <td className="px-3 py-2 text-sm">{student.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-4 text-center text-gray-500">No students match the current filters</div>
              )}
            </div>
            
            <div className="mt-2 text-sm">
              Selected: <span className="font-bold">{selectedEmails.length}</span> recipients
            </div>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold">Email Content</h2>
              <div>
                <label className="mr-2 inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={useTemplate}
                    onChange={(e) => setUseTemplate(e.target.checked)}
                    className="mr-1"
                  />
                  <span>Use Template</span>
                </label>
                {useTemplate && (
                  <select
                    value={selectedTemplate}
                    onChange={(e) => handleTemplateSelection(e.target.value)}
                    className="p-1 border rounded"
                  >
                    <option value="">Select Template</option>
                    {templates.map(template => (
                      <option key={template.id} value={template.id}>{template.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            
            {useTemplate && selectedTemplate && (
              <div className="mb-4 p-3 bg-white border rounded">
                <h3 className="font-medium mb-2">Template Variables</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Object.keys(templateVars).map(key => (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-1">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                      <input
                        type="text"
                        value={templateVars[key as keyof typeof templateVars]}
                        onChange={(e) => setTemplateVars({...templateVars, [key]: e.target.value})}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                placeholder="Email Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                placeholder="Write your email message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border rounded"
                rows={6}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Attachments</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Event Link</label>
              <input
                type="text"
                placeholder="Optional: Add an event link"
                value={eventLink}
                onChange={(e) => setEventLink(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Form Link</label>
              <input
                type="text"
                placeholder="Optional: Add a form link"
                value={formLink}
                onChange={(e) => setFormLink(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <button 
              onClick={sendEmails}
              disabled={isSending}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              {isSending ? `Sending... (${sendingProgress}%)` : 'Send Emails'}
            </button>
          </div>
          
          {/* Sending Errors */}
          {sendingErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
              <h3 className="font-bold text-red-600 mb-2">Failed to send to:</h3>
              <ul>
                {sendingErrors.map((error, index) => (
                  <li key={index} className="text-sm text-red-500">
                    {error.email}: {error.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Activity Log */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="font-bold mb-2">Activity Log</h2>
            <div className="max-h-48 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="text-sm text-gray-600 mb-1">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default EmailsAdminPage;