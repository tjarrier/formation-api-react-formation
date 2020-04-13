import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/customersAPI";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const CustomersPage = (props) => {
	const [customers, setCustomers] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);

	const fetchCustomer = async () => {
		try {
			const data = await CustomersAPI.findAll();
			setCustomers(data);
			setLoading(false);
		} catch (error) {
			toast.error("Impossible de charger les clients !");
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
			toast.success("Le client a bien été supprimé !");
		} catch (error) {
			toast.error("La suppression du client n'a pas fonctioné !");
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
			<div className="mb-3 d-flex justify-content-between align-items-center">
				<h1>Liste des clients</h1>
				<Link to="/customers/new" className="btn btn-primary">
					Créer un client
				</Link>
			</div>
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
				{!loading && (
					<tbody>
						{paginatedCustomers.map((customer) => (
							<tr key={customer.id}>
								<td>{customer.id}</td>
								<td>
									<Link to={`/customers/${customer.id}`}>
										{customer.firstname} {customer.lastname}
									</Link>
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
				)}
			</table>
			{loading && <TableLoader />}
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
