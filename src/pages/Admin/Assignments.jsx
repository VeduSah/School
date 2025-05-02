import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  AssignmentsContainer,
  Content,
  AssignmentsContent,
  AssignmentsHeader,
  AssignmentList,
  AssignmentItem,
  AddAssignmentForm,
  AddAssignmentInput,
  AddAssignmentTextArea,
  AddAssignmentButton,
} from '../../styles/AssignmentsStyles';

const Assignments = () => {
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', grade: '', deadline: '' });
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/assignments/getall');
      if (response.data.success) {
        setAssignments(response.data.assignments);  // Set assignments directly from the response
      } else {
        console.warn('Failed to fetch assignments:', response.data);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };
  

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (newAssignment.title.trim() !== '' && newAssignment.description.trim() !== '' && newAssignment.grade.trim() !== '' && newAssignment.deadline.trim() !== '') {
      try {
        const response = await axios.post('http://localhost:4000/api/v1/assignments', newAssignment);
        if (response.data.success) {  // Ensure success is true before updating state
          toast.success('Assignment added successfully');
          setAssignments([...assignments, response.data.assignment]);  // Add new assignment
          setNewAssignment({ title: '', description: '', grade: '', deadline: '' });
        } else {
          toast.error('Failed to add assignment');
        }
      } catch (error) {
        console.error('Error adding assignment:', error);
        toast.error('Error adding assignment');
      }
    }
  };
  

  return (
    <AssignmentsContainer>
      <ToastContainer />
      <Sidebar />
      <Content>
        <AssignmentsContent>
          <AssignmentsHeader>Assignments</AssignmentsHeader>
          <AddAssignmentForm onSubmit={handleAddAssignment}>
            <AddAssignmentInput
              type="text"
              placeholder="Enter assignment title"
              value={newAssignment.title}
              onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
            />
            <AddAssignmentTextArea
              placeholder="Enter assignment description"
              value={newAssignment.description}
              onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
            />
            <AddAssignmentInput
              type="text"
              placeholder="Enter assignment grade"
              value={newAssignment.grade}
              onChange={(e) => setNewAssignment({ ...newAssignment, grade: e.target.value })}
            />
            <AddAssignmentInput
              type="text"
              placeholder="Enter assignment deadline"
              value={newAssignment.deadline}
              onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
            />
            <AddAssignmentButton type="submit">Add Assignment</AddAssignmentButton>
          </AddAssignmentForm>
          <AssignmentList>
  {assignments.length === 0 ? (
    <p>No assignments available.</p>
  ) : (
    assignments.map((assignment) => (
      assignment && assignment.title ? (  // Ensure title exists before rendering
        <AssignmentItem key={assignment._id}>
          <strong>{assignment.title}: </strong>
          {assignment.description}, {assignment.grade}, {assignment.deadline}
        </AssignmentItem>
      ) : (
        <p key={assignment._id}>Assignment data is missing.</p>  // Handle missing data
      )
    ))
  )}
</AssignmentList>

        </AssignmentsContent>
      </Content>
    </AssignmentsContainer>
  );
};

export default Assignments;
