import React, { useState, useContext } from "react";
import CustomersAPI from "../services/customersAPI";
import AuthAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";

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
				<div className="form-group">
					<label htmlFor="username">Adresse email</label>
					<input
						value={credentials.username}
						onChange={handleChange}
						type="email"
						placeholder="Adresse email de connexion"
						name="username"
						id="username"
						className={"form-control" + (error && " is-invalid")}
					/>
					{error && <p className="invalid-feedback">{error}</p>}
				</div>
				<div className="form-group">
					<label htmlFor="password">Mot de passe</label>
					<input
						value={credentials.password}
						onChange={handleChange}
						type="password"
						placeholder="Mot de passe"
						name="password"
						id="passwrd"
						className="form-control"
					/>
				</div>
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
