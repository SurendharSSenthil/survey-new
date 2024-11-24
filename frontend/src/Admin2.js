import React, { useState } from "react";
import './Main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { url } from './url';
import { Table,Spin,notification } from 'antd';
// import 'antd/dist/antd.css';

const Admin2 = () => {
    const [std, setStd] = useState([]);
    const [loading,setLoading] = useState(false);
    
        const fetchData = async (e) => {
            setLoading(true);
            try {
                const stdListResponse = await fetch(`${url}/admin/studentList/${e.target.value}`);
                const stdList = await stdListResponse.json();
                if(!(stdList.length > 0)){
                    setLoading(false);
                    setStd([]);
                    notification.info({
                        message: 'No response Found',
                        description: `No students in sem ${e.target.value}`,
                    });
                }
                else{
                const studentsWithCourses = await Promise.all(
                    stdList.map(async (student) => {
                        const res = await fetch(`${url}/student/submission/${student.stdId}`);
                        const courses = await res.json();
                        console.log(courses);

                        return {
                            RegNo: student.stdId,
                            Name: student.stdName,
                            CoursesSubmitted: courses
                        };
                    })
                );

                setStd(studentsWithCourses);
                setLoading(false);
            }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };


    const columns = [
        {
            title: 'Register No',
            dataIndex: 'RegNo',
            key: 'RegNo',
        },
        {
            title: 'Student Name',
            dataIndex: 'Name',
            key: 'Name',
        },
        {
            title: 'Number of Courses Submitted',
            dataIndex: 'CoursesSubmitted',
            key: 'CoursesSubmitted',
            render: (text) => <div>{text}</div>,
        },
    ];

    return (
        <>
        <h3>Feedback submission</h3>
        <div className="selectDiv">
            <label className="divLabel">Select the Semester : </label>
            <select
                id="sem"
                className="form-control admin-page"
                onChange={fetchData}
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
        {
            loading ? (<div id="spin"><Spin size="large"></Spin></div>) : 
            std.length>0 ? (
            <Table dataSource={std} columns={columns} />) : <></>
        }
        </>
    );
};

export default Admin2;