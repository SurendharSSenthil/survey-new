import React from "react";
import { Form, Input, Button, Typography, message } from "antd";
import "./Auth.css";
import { url } from "./url";

const { Title } = Typography;

const Auth = ({
	regNo,
	setRegNo,
	dob,
	setDob,
	isAuth,
	setIsAuth,
	stdName,
	setStdName,
}) => {
	const [form] = Form.useForm();

	const handleSubmit = () => {
		fetch(`${url}/student/auth`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ regNo, dob }),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res !== "Wrong password") {
					setIsAuth(true);
					setStdName(res[0].StdName);
					localStorage.setItem("isAuth", true);
					localStorage.setItem("studentId", regNo);
					message.success("Login successful!");
				} else {
					form.resetFields();
					setIsAuth(false);
					message.error("Wrong register number or date of birth");
				}
			})
			.catch((err) => {
				console.log(err);
				message.error("An error occurred. Please try again.");
			});
	};

	return (
		<div className="main__login__container">
			<div>
				<Title className="root-header" level={2}>
					Course Feedback
				</Title>

				<div className="login__container">
					<Title level={3} className="login__header">
						Login
					</Title>
					<Form form={form} onFinish={handleSubmit} className="login__form">
						<Form.Item
							label="Register Number"
							name="regNo"
							rules={[
								{
									required: true,
									message: "Please input your register number!",
								},
							]}
						>
							<Input
								value={regNo}
								onChange={(e) => setRegNo(e.target.value)}
								className="login__input"
							/>
						</Form.Item>
						<Form.Item
							label="Date Of Birth"
							name="dob"
							rules={[
								{ required: true, message: "Please input your date of birth!" },
							]}
						>
							<Input
								value={dob}
								onChange={(e) => setDob(e.target.value)}
								placeholder="DD-MM-YYYY"
								className="login__input"
							/>
						</Form.Item>
						<Form.Item>
							<Button
								type="primary"
								htmlType="submit"
								className="login__button"
							>
								Login
							</Button>
						</Form.Item>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default Auth;
