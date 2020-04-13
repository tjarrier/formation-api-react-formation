import React, { useState, useContext } from "react";
import CustomersAPI from "../services/customersAPI";
import AuthAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";

const LoginPage = ({ history }) => {
	const [credentials, setCredentials] = useState({
		username: "",
		password: "",
	});
	const [error, setError] = useState("");
	const { setIsAuthenticated } = useContext(AuthContext);

	// Gestion des champs
	const handleChange = ({ currentTarget }) => {
		const { value, name } = currentTarget;
		setCredentials({
			...credentials,
			[name]: value,
		});
	};

	// Gestion du submit
	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			await AuthAPI.authenticate(credentials);
			setIsAuthenticated(true);
			setError("");
			history.replace("/customers");
		} catch (error) {
			setError(
				"Aucun compte ne possède cette adresse ou alors les informations ne correspondent pas !"
			);
		}
	};

	return (
		<>
			<h1>Connexion à l'application</h1>
			<form onSubmit={handleSubmit}>
				<Field
					label={"Adresse email"}
					value={credentials.username}
					onChange={handleChange}
					type="email"
					placeholder="Adresse email de connexion"
					name="username"
					error={error}
				/>
				<Field
					label={"Mot de passe"}
					value={credentials.passeword}
					onChange={handleChange}
					type="password"
					name="password"
				/>
				<div className="form-group">
					<button type="submit" className="btn btn-success">
						Je me connecte
					</button>
				</div>
			</form>
		</>
	);
};

export default LoginPage;
