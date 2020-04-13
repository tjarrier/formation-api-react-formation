import moment from "moment";
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/invoicesAPI";
import { Link } from "react-router-dom";

const STATUS_CLASSES = {
	PAID: "success",
	SENT: "primary",
	CANCELLED: "danger",
};

const STATUS_LABELS = {
	PAID: "Payée",
	SENT: "Envoyée",
	CANCELLED: "Annulée",
};

const InvoicesPage = (props) => {
	const [invoices, setInvoices] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [search, setSearch] = useState("");
	const itemsPerPage = 10;

	// Récupération des invoices auprès le l'API
	const fetchInvoices = async () => {
		try {
			const data = await InvoicesAPI.findAll();
			setInvoices(data);
		} catch (error) {
			console.log(error);
		}
	};

	// Charger les invoices au chargement du composant
	useEffect(() => {
		fetchInvoices();
	}, []);

	// Gestion du format de date
	const formatDate = (str) => moment(str).format("DD/MM/YYYY");

	// Gestion du changement de pase
	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	// Gestion de la recherche
	const handleSearch = ({ currentTarget }) => {
		setSearch(currentTarget.value);
		setCurrentPage(1);
	};

	const handleDelete = async (id) => {
		const originalInvoices = [...invoices];
		setInvoices(invoices.filter((i) => i.id !== id));
		try {
			await InvoicesAPI.delete(id);
		} catch (error) {
			console.log(error);
			setInvoices(originalInvoices);
		}
	};

	// Filtrage des invoices
	const filteredInvoices = invoices.filter(
		(i) =>
			i.customer.firstname.toLowerCase().includes(search.toLowerCase()) ||
			i.customer.lastname.toLowerCase().includes(search.toLowerCase()) ||
			i.amount.toString().startsWith(search.toLowerCase()) ||
			STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
	);

	// Pagination des données
	const paginatedInvoices = Pagination.getData(
		filteredInvoices,
		currentPage,
		itemsPerPage
	);

	return (
		<>
			<div className="d-flex justify-content-between align-items-center">
				<h1>Liste des factures</h1>
				<Link to="/invoices/new" className="btn btn-primary">
					Créer une facture
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
						<th>Numéro</th>
						<th>Client</th>
						<th className="text-center">Date d'envoi</th>
						<th className="text-center">Statut</th>
						<th className="text-center">Montant</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{paginatedInvoices.map((invoice) => (
						<tr key={invoice.id}>
							<td>{invoice.chrono}</td>
							<td>
								<a href="#">
									{invoice.customer.firstname}{" "}
									{invoice.customer.lastname}
								</a>
							</td>
							<td className="text-center">
								{formatDate(invoice.sentAt)}
							</td>
							<td className="text-center">
								<span
									className={
										"badge badge-" +
										STATUS_CLASSES[invoice.status]
									}>
									{STATUS_LABELS[invoice.status]}
								</span>
							</td>
							<td className="text-center">
								{invoice.amount.toLocaleString()} &euro;
							</td>
							<td>
								<Link
									to={"/invoices/" + invoice.id}
									className="btn btn-sm btn-primary mr-1">
									Editer
								</Link>
								<button
									className="btn btn-sm btn-danger"
									onClick={() => handleDelete(invoice.id)}>
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
				onPageChanged={handlePageChange}
				length={filteredInvoices.length}
			/>
		</>
	);
};

export default InvoicesPage;
