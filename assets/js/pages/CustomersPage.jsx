import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/customersAPI";
const CustomersPage = (props) => {
	const [customers, setCustomers] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [search, setSearch] = useState("");

	const fetchCustomer = async () => {
		try {
			const data = await CustomersAPI.findAll();
			setCustomers(data);
		} catch (error) {
			console.log(error.response);
		}
	};

	useEffect(() => {
		fetchCustomer();
	}, []);

	const handleDelete = async (id) => {
		const originalCustomer = [...customers];
		setCustomers(customers.filter((customer) => id !== customer.id));
		try {
			await CustomersAPI.delete(id);
		} catch (error) {
			console.log(error);
			setCustomers(originalCustomer);
		}
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const handleSearch = ({ currentTarget }) => {
		setSearch(currentTarget.value);
		setCurrentPage(1);
	};

	const itemsPerPage = 10;

	// Filtrage des customers
	const filteredCustomer = customers.filter(
		(c) =>
			c.firstname.toLowerCase().includes(search.toLowerCase()) ||
			c.lastname.toLowerCase().includes(search.toLowerCase()) ||
			c.email.toLowerCase().includes(search.toLowerCase()) ||
			(c.company &&
				c.company.toLowerCase().includes(search.toLowerCase()))
	);

	// Pagination des données
	const paginatedCustomers = Pagination.getData(
		filteredCustomer,
		currentPage,
		itemsPerPage
	);

	return (
		<>
			<h1>Liste des clients</h1>
			<div className="form-group">
				<input
					type="text"
					className="form-control"
					placeholder="Chercher..."
					onChange={handleSearch}
					value={search}
				/>
			</div>
			<table className="table table-hover">
				<thead>
					<tr>
						<th>Identifiant</th>
						<th>Client</th>
						<th>Email</th>
						<th>Entreprise</th>
						<th className="text-center">Factures</th>
						<th className="text-center">Montant total</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{paginatedCustomers.map((customer) => (
						<tr key={customer.id}>
							<td>{customer.id}</td>
							<td>
								<a href="#">
									{customer.firstname} {customer.lastname}
								</a>
							</td>
							<td>{customer.email}</td>
							<td>{customer.company}</td>
							<td className="text-center">
								<span className="badge badge-primary">
									{customer.invoices.length}
								</span>
							</td>
							<td className="text-center">
								{customer.totalAmount.toLocaleString()} &euro;
							</td>
							<td>
								<button
									onClick={() => handleDelete(customer.id)}
									disabled={customer.invoices.length > 0}
									className="btn btn-sm btn-danger">
									Supprimer
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{itemsPerPage < filteredCustomer.length && (
				<Pagination
					currentPage={currentPage}
					itemsPerPage={itemsPerPage}
					length={filteredCustomer.length}
					onPageChanged={handlePageChange}
				/>
			)}
		</>
	);
};

export default CustomersPage;
