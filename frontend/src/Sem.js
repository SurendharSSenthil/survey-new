import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { notification } from 'antd';

function Sem({ sem, setSem, year, setYear, setTable, flag }) {
  const handleChange = async(e) => {
    const selectedSem = e.target.value;
    setSem(e.target.value);
    if(selectedSem !== flag)
      {
        setTable(false);
        notification.error({
          message:"You are not allowed",
          description:`You are not allowed to submit the response for ${selectedSem} semester.Please select the correct semester.`
        })
      }
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <label htmlFor="year">Year:</label>
          <select
            id="year"
            className="form-control"
            value={year}
          >
            <option value="1">I</option>
            <option value="2">II</option>
            <option value="3">III</option>
            <option value="4">IV</option>
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="sem">Semester:</label>
          <select
            id="sem"
            className="form-control"
            onChange={handleChange}
            value={sem}
          >
            <option value="I">I</option>
            <option value="II">II</option>
            <option value="III">III</option>
            <option value="IV">IV</option>
            <option value="V">V</option>
            <option value="VI">VI</option>
            <option value="VII">VII</option>
            <option value="VIII">VIII</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Sem;
