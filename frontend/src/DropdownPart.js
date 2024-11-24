import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Row, Col, Card } from 'react-bootstrap';
import { url } from './url';

const DropdownPart = ({ courseName, setCourseName, courses, courseId, setCourseId, questions, setQuestion, setTable }) => {
  async function handleOptionChange(e) {
    if(e.target.value==="") {
      return;
    }
    else
      {
        const coursecode = e.target.value;
        await setCourseName(courses[coursecode]);
        setCourseId(coursecode);
        console.log(coursecode);
        const data = await fetch(`${url}/student/courses/${coursecode}`);
        const jsondata = await data.json();
        setQuestion(jsondata.questions);
        setTable(true);
      }
  };

  return (
    <Card className="m-4 p-4 shadow">
      <Form>
        <Row className="mb-3">
          <Form.Label column sm="2" className="fw-bold">
            Select a Course:
          </Form.Label>
          <Col sm="10">
            <Form.Select
              className="form-select select-dropdown"
              value={courseId}
              onChange={handleOptionChange}
              required
            >
              <option value="">--Select--</option>
              {Object.entries(courses).map(([courseCode, coursename]) => (
                <option key={courseCode} value={courseCode}>{coursename}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {courseName && (
        <div className="selected-info mt-4">
          {/* <h5 className="mb-3">Selected Course Information:</h5> */}
          <p className="course-info"><strong>Course Name:</strong> {courseName}</p>
          <p className="course-info"><strong>Course Code:</strong> {courseId}</p>
        </div>
      )}
    </Card>
  );
};

export default DropdownPart;
