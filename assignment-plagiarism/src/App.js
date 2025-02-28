import React, { useState } from "react";
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      subject: "Mathematics",
      topic: "Algebra",
      deadline: "2023-10-15",
      submitted: false,
    },
    {
      id: 2,
      subject: "Science",
      topic: "Physics",
      deadline: "2023-10-20",
      submitted: true,
    },
    {
      id: 3,
      subject: "History",
      topic: "World War II",
      deadline: "2023-10-25",
      submitted: false,
    },
  ]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setModalContent({ title: 'Login Successful', message: 'Welcome back!' });
    setShowModal(true);
  };

  const checkPlagiarism = () => {
    // Simulate plagiarism check with random result (0-30%)
    return Math.floor(Math.random() * 30);
  };

  const handleSubmit = (assignmentId) => {
    if (!currentFile) {
      setModalContent({ title: 'Error', message: 'Please select a file first!' });
      setShowModal(true);
      return;
    }

    // Simulate background check (1-2 seconds delay)
    setTimeout(() => {
      const plagiarismScore = checkPlagiarism();
      
      if (plagiarismScore > 20) {
        setModalContent({
          title: 'Submission Rejected',
          message: `Plagiarism detected: ${plagiarismScore}% similarity. Please revise your work.`,
        });
      } else {
        setAssignments(prevAssignments =>
          prevAssignments.map(assignment =>
            assignment.id === assignmentId
              ? { ...assignment, submitted: true }
              : assignment
          )
        );
        setModalContent({
          title: 'Submission Successful',
          message: 'Your work has been successfully submitted!',
        });
      }
      setShowModal(true);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  return (
    <div className="app-container p-4">
      {!isLoggedIn ? (
        <div className="login-screen flex items-center justify-center h-screen">
          <div className="login-container bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
            <div className="login-header mb-4">
              <h2 className="text-2xl font-bold">Welcome Back</h2>
              <p className="text-gray-600">Please sign in to continue</p>
            </div>
            <div className="login">
            <form onSubmit={handleLogin} className="login-form">
            <div className="input-group mb-2 flex justify-center items-center">

                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="input-wrapper">
                  <input type="email" className="input-field border border-gray-300 rounded-md p-2 w-full" placeholder="john@example.com" required />
                </div>
              </div>
              <div className="input-group mb-4">
                <label className="block text-sm font-medium mb-1">Password</label>
                <input type="password" className="input-field border border-gray-300 rounded-md p-2 w-full" placeholder="••••••••" required />
              </div>
              <button type="submit" className="login-btn bg-blue-500 text-white rounded-md p-2 w-full hover:bg-blue-600">Sign In</button>
            </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="assignments-container">
          <div className="assignments-header flex justify-between items-center mb-4">
            <h1 className="assignments-title text-2xl font-bold">Your Assignments</h1>
            <button className="logout-btn bg-red-500 text-white rounded-md p-2 hover:bg-red-600">
              Logout
            </button>
          </div>

          <div className="assignments-list grid grid-cols-1 gap-4">
            {assignments.map(assignment => (
              <div key={assignment.id} className="assignment-card bg-white shadow-md rounded-lg p-4">
                <div className="assignment-header flex justify-between items-center mb-2">
                  <div>
                    <h3 className="assignment-subject text-lg font-semibold">{assignment.subject}</h3>
                    <p className="assignment-topic text-gray-600">{assignment.topic}</p>
                  </div>
                  <span className={`status-badge ${assignment.submitted ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'} rounded-full px-2 py-1`}>
                    {assignment.submitted ? 'Submitted' : 'Pending'}
                  </span>
                </div>

                <div className="assignment-footer flex justify-between items-center">
                  <div className="deadline-info">
                    <span className="text-gray-600">Due {assignment.deadline}</span>
                  </div>

                  {!assignment.submitted && (
                    <div className="file-upload-group flex items-center">
                      <label className="file-input-label cursor-pointer text-blue-500 hover:underline">
                        <input type="file" className="hidden" onChange={(e) => setCurrentFile(e.target.files[0])} />
                        Choose File
                      </label>
                      <button onClick={() => handleSubmit(assignment.id)} className="submit-btn bg-blue-500 text-white rounded-md p-2 ml-2 hover:bg-blue-600">
                        Submit
                      </button>
                    </div>
                  )}
                </div>

                {currentFile && !assignment.submitted && (
                  <p className="selected-file text-gray-600 mt-2">Selected file: {currentFile.name}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="modal-content bg-white rounded-lg p-6 w-11/12 max-w-md">
            <div className={`modal-icon ${modalContent.title.includes("Error") ? 'text-red-500' : 'text-green-500'} mb-4`}>
              {/* SVG icon here */}
            </div>
            <h3 className="modal-title text-lg font-bold">{modalContent.title}</h3>
            <p className="modal-message text-gray-600">{modalContent.message}</p>
            <button onClick={() => setShowModal(false)} className="modal-close-btn bg-gray-300 rounded-md p-2 mt-4 hover:bg-gray-400">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;