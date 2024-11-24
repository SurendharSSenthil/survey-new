import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCheckCircle,
	faEnvelope,
	faPhone,
	faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import Sem from './Sem';
import Student from './Student';
import DropdownPart from './DropdownPart';
import { url } from './url';
import { notification } from 'antd';

function Main({
	regNo,
	setRegNo,
	dob,
	setDob,
	isAuth,
	setIsAuth,
	stdName,
	setStdName,
}) {
	const [updated, setUpdated] = useState(false);
	const [responses, setResponses] = useState([]);
	const [courseName, setCourseName] = useState('');
	const [courseId, setCourseId] = useState('');
	const [sem, setSem] = useState('');
	const [year, setYear] = useState('III');
	const [email, setEmail] = useState('');
	const [phNo, setPhNo] = useState('');
	const [duplicate, setDuplicate] = useState(false);
	const [ret, setRet] = useState(false);
	const [question, setQuestion] = useState([]);
	const [table, setTable] = useState(false);
	const [courses, setCourses] = useState([]);
	const [flag, setFlag] = useState('');
	useEffect(() => {
		const storedStudentId = localStorage.getItem('studentId');
		console.log(storedStudentId);

		if (storedStudentId) {
			const fetchStudentData = async () => {
				try {
					setRegNo(storedStudentId);
					const response = await fetch(`${url}/student/${storedStudentId}`);

					if (response.ok) {
						const studentData = await response.json();
						console.log(studentData);
						if (studentData !== 'Student Not Found') {
							setStdName(studentData.stdName);
							setEmail(studentData.email);
							setPhNo(studentData.phNo);
							setCourses(studentData.courselist);
							setSem(studentData.sem);
							setYear(studentData.year);
							console.log(studentData.year);
							setFlag(studentData.sem);
							setRet(true);
							console.log(studentData.courselist);
						}
					}
				} catch (error) {
					console.error('Error fetching student data:');
				}
			};

			fetchStudentData();
		}
	}, []);

	const handleOptionChange = (id, question, selectedOption) => {
		const updatedResponses = [...responses];
		const existingResponseIndex = updatedResponses.findIndex(
			(response) => response.qid === id
		);

		if (existingResponseIndex !== -1) {
			updatedResponses[existingResponseIndex].response = selectedOption;
		} else {
			updatedResponses.push({ qid: id, question, response: selectedOption });
		}

		setResponses(updatedResponses);
		// console.log(updatedResponses);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!courseName || responses.length !== question.length) {
			notification.warning({
				message: 'Incomplete Data',
				description: 'Please fill out all the fields',
			});
			return;
		} else {
			const formData = {
				stdName,
				regNo,
				email,
				phNo,
				courseName,
				courseId,
				sem,
				year,
				responses,
			};

			fetch(`${url}/student/submit-form`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			})
				.then((response) => response.json())
				.then((data) => {
					console.log('Response from server:', data);
					if (data === 'Duplicate Entry') {
						setDuplicate(true);
						setUpdated(false);
					} else if (data === 'Internal Server Error') {
						alert('course is not selected!');
					} else {
						setUpdated(true);
					}
				})
				.catch((error) => console.error('Error sending POST request:', error));
			setTable(false);
			console.log('Form data sent to server:', formData);
		}
	};

	const ReturnBtn = (e) => {
		setDuplicate(false);
		setUpdated(false);
		setCourseName('');
		setResponses([]);
	};

	const handleLogOut = () => {
		localStorage.removeItem('studentId');
		setIsAuth(false);
		localStorage.removeItem('isAuth');
		setRegNo('');
		setDob('');
	};

	return (
		<div>
			<div className='header'>
				<h1 className='topic'>Evaluation Form</h1>
				<button onClick={handleLogOut} className='logOut'>
					Log Out
				</button>
			</div>
			{updated ? (
				<div className='submitted'>
					<FontAwesomeIcon icon={faCheckCircle} beatFade size='lg' />
					<div>Form Successfully Submitted</div>
					<button onClick={(e) => ReturnBtn(e)}>
						Form for another subject
					</button>
				</div>
			) : duplicate ? (
				<div className='duplicate'>
					<FontAwesomeIcon icon={faThumbsUp} bounce className='thumbsUp' />
					<div>
						{stdName} has already submitted the response for the {courseName}
					</div>
					<button
						onClick={(e) => {
							ReturnBtn(e);
						}}
					>
						Back
					</button>
				</div>
			) : (
				<div>
					<form onSubmit={handleSubmit} className='formcard'>
						<Student
							stdName={stdName}
							setStdName={setStdName}
							regNo={regNo}
							setRegNo={setRegNo}
							ret={ret}
							setRet={setRet}
						/>
						<div className='form-group'>
							<label htmlFor='email'>
								<FontAwesomeIcon icon={faEnvelope} className='fontIcon' />
								Email:
							</label>
							<input
								type='email'
								className='form-control'
								id='email'
								placeholder='Example@gmail.com'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={ret}
							/>
						</div>

						<div className='form-group'>
							<label htmlFor='phno'>
								<FontAwesomeIcon icon={faPhone} className='fontIcon' />
								Mobile Number:
							</label>
							<input
								type='tel'
								className='form-control'
								id='ph-no'
								placeholder='Mobile Number'
								value={phNo}
								onChange={(e) => setPhNo(e.target.value)}
								required
								disabled={ret}
							/>
						</div>

						<div className='semOption'>
							<Sem
								sem={sem}
								setSem={setSem}
								year={year}
								setYear={setYear}
								setTable={setTable}
								flag={flag}
							/>
						</div>
						{flag === sem && (
							<DropdownPart
								courseName={courseName}
								setCourseName={setCourseName}
								courses={courses}
								courseId={courseId}
								setCourseId={setCourseId}
								questions={question}
								setQuestion={setQuestion}
								setTable={setTable}
							/>
						)}

						{table && (
							<table className='table table-bordered table-striped'>
								<thead>
									<tr>
										<th>Questions</th>
										<th>Strongly agree</th>
										<th>Agree</th>
										<th>Neutral</th>
										<th>Disagree</th>
										<th>Strongly Disagree</th>
									</tr>
								</thead>
								<tbody>
									{question.map((question) => (
										<tr
											key={question.qid}
											className={
												question.qid % 2 === 0 ? 'even-row' : 'odd-row'
											}
										>
											<td>{question.question}</td>
											<td>
												<input
													type='radio'
													name={`response-${question.qid}`}
													value='Strongly agree'
													onChange={(e) =>
														handleOptionChange(
															question.qid,
															question.question,
															e.target.value
														)
													}
												/>
											</td>
											<td>
												<input
													type='radio'
													name={`response-${question.qid}`}
													value='Agree'
													onChange={(e) =>
														handleOptionChange(
															question.qid,
															question.question,
															e.target.value
														)
													}
												/>
											</td>
											<td>
												<input
													type='radio'
													name={`response-${question.qid}`}
													value='Neutral'
													onChange={(e) =>
														handleOptionChange(
															question.qid,
															question.question,
															e.target.value
														)
													}
												/>
											</td>
											<td>
												<input
													type='radio'
													name={`response-${question.qid}`}
													value='Disagree'
													onChange={(e) =>
														handleOptionChange(
															question.qid,
															question.question,
															e.target.value
														)
													}
												/>
											</td>
											<td>
												<input
													type='radio'
													name={`response-${question.qid}`}
													value='Strongly Disagree'
													onChange={(e) =>
														handleOptionChange(
															question.qid,
															question.question,
															e.target.value
														)
													}
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
						<div className='d-flex'>
							<button
								type='submit'
								onClick={(e) => {
									handleSubmit(e);
								}}
							>
								Submit
							</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}

export default Main;
