import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";

const CustomersPageWithPagination = (props) => {
	const [customers, setCustomers] = useState([]);
	const [totalItems, setTotalItems] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const itemsPerPage = 10;

	useEffect(() => {
		axios
			.get(
				`https://127.0.0.1:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`,
				{}
			)
			.then((response) => {
				setCustomers(response.data["hydra:member"]);
				setTotalItems(response.data["hydra:totalItems"]);
				setLoading(false);
			})
			.catch((error) => console.log(error));
	}, [currentPage]);

	const handleDelete = (id) => {
		const originalCustomer = customers;
		// 1. L'approche optimiste
		setCustomers(customers.filter((customer) => id !== customer.id));
		// 2. L'approche pessimiste
		axios
			.delete(`https://127.0.0.1:8000/api/customers/${id}`, {})
			.then((response) => {
				console.log("OK");
			})
			.catch((error) => {
				console.log(error.response);
				setCustomers(originalCustomer);
			});
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
		setLoading(true);
	};

	const paginatedCustomers = Pagination.getData(
		customers,
		currentPage,
		itemsPerPage
	);

	return (
		<>
			<h1>Liste des clients (pagination)</h1>
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
					{loading && (
						<tr>
							<td>Chargement...</td>
						</tr>
					)}
					{!loading &&
						customers.map((customer) => (
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
									{customer.totalAmount.toLocaleString()}{" "}
									&euro;
								</td>
								<td>
									<button
										onClick={() =>
											handleDelete(customer.id)
										}
										disabled={customer.invoices.length > 0}
										className="btn btn-sm btn-danger">
										Supprimer
									</button>
								</td>
							</tr>
						))}
				</tbody>
			</table>
			<Pagination
				currentPage={currentPage}
				itemsPerPage={itemsPerPage}
				length={totalItems}
				onPageChanged={handlePageChange}
			/>
		</>
	);
};

export default CustomersPageWithPagination;
