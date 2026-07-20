import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ClientForm from "../../features/clients/components/ClientForm/ClientForm";
import {
  createClient,
  deleteClient,
  getClients,
  updateClient,
} from "../../features/clients/api/clientApi";
import type { Client } from "../../features/clients/types";
import type { ClientFormValues } from "../../features/clients/schemas/clientSchema";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../components/common/Pagination/Pagination";
import SearchBar from "../../components/common/SearchBar/SearchBar";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import Card, { CardHeader, CardActions } from "../../components/common/Card/Card";
import EmptyState from "../../components/common/EmptyState/EmptyState";
import Button from "../../components/common/Button/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog/ConfirmDialog";
import { useLoader } from "../../contexts/LoaderContext";
import styles from "./ClientsPage.module.css";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
  const { showLoader, hideLoader } = useLoader();

  const {
    page,
    searchInput,
    debouncedSearch,
    handleSearchChange,
    handlePageChange,
    getPaginationParams,
  } = usePagination();

  useEffect(() => {
    loadClients();
  }, [page, debouncedSearch]);

  async function loadClients() {
    try {
      showLoader();
      const response = await getClients(getPaginationParams());
      setClients(response.data ?? []);
      setTotalPages(response.total_pages || 1);
    } catch {
      toast.error("Failed to load clients.");
    } finally {
      hideLoader();
    }
  }

  async function handleSubmit(values: ClientFormValues) {
    try {
      showLoader();
      const payload = { ...values, email: values.email ?? "" };

      if (selectedClient) {
        await updateClient(selectedClient.id, payload);
        toast.success("Client updated successfully");
      } else {
        await createClient(payload);
        toast.success("Client created successfully");
      }
      setSelectedClient(null);
      await loadClients();
    } catch {
      toast.error("Failed to save client.");
      hideLoader();
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      showLoader();
      await deleteClient(deleteTarget.id);
      toast.success("Client deleted successfully");
      if (selectedClient?.id === deleteTarget.id) {
        setSelectedClient(null);
      }
      setDeleteTarget(null);
      await loadClients();
    } catch {
      toast.error("Failed to delete client.");
      hideLoader();
    }
  }

  function handleCancelEdit() {
    setSelectedClient(null);
  }

  return (
    <>
      <PageHeader title="Clients">
        <SearchBar
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search clients..."
        />
      </PageHeader>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {selectedClient ? "Edit Client" : "Add New Client"}
        </h2>
        <ClientForm
          initialData={selectedClient ?? undefined}
          onSubmit={handleSubmit}
          onCancel={selectedClient ? handleCancelEdit : undefined}
        />
      </div>

      <hr />

      <div className={styles.section}>
        {clients.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No clients found"
            message="Add your first client using the form above, or adjust your search."
          />
        ) : (
          <div className={styles.listGrid}>
            {clients.map((client) => (
              <Card key={client.id}>
                <CardHeader
                  title={client.name}
                  subtitle={client.organisation}
                />
                <div className={styles.clientMeta}>
                  {client.email && <span>✉ {client.email}</span>}
                  {client.phone && <span>☎ {client.phone}</span>}
                  {client.city && <span>📍 {client.city}{client.state ? `, ${client.state}` : ""}</span>}
                </div>
                <CardActions>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedClient(client)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteTarget(client)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))}
          </div>
        )}

        {clients.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Client"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
