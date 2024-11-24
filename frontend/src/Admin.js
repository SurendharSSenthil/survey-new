import React, { useEffect, useState } from "react";
import { Spin, Table } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css';
import { url } from './url';

const Admin = () => {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [no, setNo] = useState({});
    const [marks, setMarks] = useState({});
    const categories = ['CO1', 'CO2', 'CO3', 'CO4', 'CO5', 'CO6'];

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const res = await fetch(`${url}/admin/courses`);
                if (!res.ok) {
                    throw new Error('Failed to fetch courses');
                }
                const data = await res.json();
                console.log(data);
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourseData();
    }, []);

    useEffect(() => {
        const fetchMarksData = async () => {
            try {
                let markData = {};
                let studentCountData = {};
                for (const course of courses) {
                    for (const category of categories) {
                        const key = `${course.coursecode}-${category}`;
                        markData[key] = await fetchMark(course.coursecode, category);
                    }
                    const studentCount = await fetchNoofStudents(course.coursecode);
                    studentCountData[course.coursecode] = studentCount;
                }
                console.log(markData);
                console.log(studentCountData);
                setMarks(markData);
                setNo(studentCountData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (courses.length > 0) {
            fetchMarksData();
        }
    }, [courses]);

    const fetchMark = async (coursecode, category) => {
        try {
            const response = await fetch(`${url}/admin/markdata`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ coursecode, category }),
            });
            const data = await response.json();

            if (data && data.length > 0) {
                return data[0].totalScore;
            } else {
                return 0;
            }
        } catch (err) {
            console.error(err);
            return 0;
        }
    };

    const fetchNoofStudents = async (coursecode) => {
        try {
            const response = await fetch(`${url}/admin/${coursecode}`);
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error('Error fetching student count:', error);
            return 0;
        }
    };

    const columns = [
        {
            title: 'Course Name',
            dataIndex: 'coursename',
            key: 'coursename',
        },
        ...categories.map(category => ({
            title: `${category} - Total`,
            dataIndex: `${category}-total`,
            key: `${category}-total`,
            render: (text, record) => (marks[`${record.coursecode}-${category}`] || 0)
        })),
        ...categories.map(category => ({
            title: `${category} - Avg`,
            dataIndex: `${category}-avg`,
            key: `${category}-avg`,
            render: (text, record) => (
                no[record.coursecode] > 0 ? 
                (marks[`${record.coursecode}-${category}`] / no[record.coursecode]).toFixed(1)
                : 0
            )
        })),
        {
            title: 'No of Students',
            dataIndex: 'noOfStudents',
            key: 'noOfStudents',
            render: (text, record) => (no[record.coursecode] || 0)
        }
    ];    
    

    const data = courses.map(course => {
        const row = { key: course.coursecode, coursename: course.coursename, coursecode: course.coursecode };
        categories.forEach(category => {
            row[`${category}-total`] = '';
            row[`${category}-avg`] = '';
        });
        return row;
    });

    return (
        <div className="admin-container">
            <h3>Course End Survey Summary</h3>
            {loading ? (
                <div id="spin"><Spin size="large"></Spin></div>
            ) : (
                <div>
                    <Table dataSource={data} columns={columns} pagination={false}/>
                    <div id="footer">
                        <div id="designation">Faculty Advisor</div>
                        <div id="designation">Course Coordinator</div>
                        <div id="designation">Head Of the Department</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
