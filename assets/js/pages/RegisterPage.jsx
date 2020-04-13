import React, { useState } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import UsersAPI from "../services/usersAPI";
import { toast } from "react-toastify";

const RegisterPage = ({ history }) => {
	const [user, setUser] = useState({
		firstname: "",
		lastname: "",
		email: "",
		password: "",
		passwordConfirm: "",
	});
	const [errors, setErrors] = useState({
		firstname: "",
		lastname: "",
		email: "",
		password: "",
		passwordConfirm: "",
	});

	// Gestion des changements des inputs dans le formulaire
	const handleChange = ({ currentTarget }) => {
		const { name, value } = currentTarget;
		setUser({
			...user,
			[name]: value,
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const apiErrors = {};

		if (user.password !== user.passwordConfirm) {
			apiErrors.passwordConfirm =
				"Votre confirmation de mot de passe n'est pas conforme avec le mot de passe original";
			setErrors(apiErrors);
			toast.error("Des erreurs dans votre formulaire !");
			return;
		}

		try {
			const response = await UsersAPI.register(user);
			toast.success(
				"Vous êtes inscrit, vous pouvez désormais vous connecter !"
			);
			history.replace("/login");
			setErrors({});
		} catch ({ response }) {
			const { violations } = response.data;
			if (violations) {
				violations.forEach(({ propertyPath, message }) => {
					apiErrors[propertyPath] = message;
				});
				setErrors(apiErrors);
			}
			toast.error("Des erreurs dans votre formulaire !");
		}
	};

	return (
		<>
			<h1>Inscription</h1>
			<form onSubmit={handleSubmit}>
				<Field
					name="firstname"
					label="Prénom"
					placeholder="Votre prénom"
					error={errors.firstname}
					value={user.firstname}
					onChange={handleChange}
				/>
				<Field
					name="lastname"
					label="Nom"
					placeholder="Votre nom de famille"
					error={errors.lastname}
					value={user.lastname}
					onChange={handleChange}
				/>
				<Field
					name="email"
					label="Email"
					placeholder="Votre email"
					error={errors.email}
					value={user.email}
					onChange={handleChange}
					type="email"
				/>
				<Field
					name="password"
					label="Mot de passe"
					placeholder="Votre mot de passe"
					error={errors.password}
					value={user.password}
					onChange={handleChange}
					type="password"
				/>
				<Field
					name="passwordConfirm"
					label="Confirmation du mot de passe"
					placeholder="Confirmez votre mot de passe"
					error={errors.passwordConfirm}
					value={user.passwordConfirm}
					onChange={handleChange}
					type="password"
				/>
				<div className="form-group">
					<button type="submit" className="btn btn-success">
						Confirmation
					</button>
					<Link to="/login" className="btn btn-link">
						J'ai déjà un compte
					</Link>
				</div>
			</form>
		</>
	);
};

export default RegisterPage;
